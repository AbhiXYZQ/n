import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { sendWaitlistThankYouEmail } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body?.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check if email already exists in waitlist
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list! We'll notify you on launch day.",
        alreadyExists: true,
      });
    }

    // Save email to Supabase waitlist table
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('[Waitlist Insert Error]', insertError.message);
      // Don't block user — still try to send email
    }

    // Send thank you email via Resend
    try {
      await sendWaitlistThankYouEmail({ to: email });
    } catch (emailError) {
      console.error('[Waitlist Email Error]', emailError.message);
      // Email failed but we still saved the record — not critical
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! Check your inbox for a confirmation email. 🚀",
    });
  } catch (error) {
    console.error('[POST /api/waitlist]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET — for admin to view all waitlist entries
export async function GET(request) {
  try {
    const supabase = getSupabase();
    const { data, error, count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      total: count || 0,
      emails: data || [],
    });
  } catch (error) {
    console.error('[GET /api/waitlist]', error);
    return NextResponse.json({ success: false, message: 'Unable to fetch waitlist.' }, { status: 500 });
  }
}
