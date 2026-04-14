import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest, setSessionCookie, createSessionPayload } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json({ success: false, message: 'Invalid verification code.' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Check code validity
    const { data: verificationEntry, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', session.userId)
      .eq('type', 'EMAIL')
      .eq('code', code)
      .maybeSingle();

    if (fetchError || !verificationEntry) {
      return NextResponse.json({ success: false, message: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // 2. Check expiry
    if (new Date() > new Date(verificationEntry.expires_at)) {
      return NextResponse.json({ success: false, message: 'Code has expired. Please request a new one.' }, { status: 400 });
    }

    // 3. Update user as verified
    const now = new Date().toISOString();
    
    // Fetch current verification state to preserve other fields (like phoneVerified)
    const { data: user } = await supabase
      .from('users')
      .select('id, role, email, contact_verification')
      .eq('id', session.userId)
      .maybeSingle();

    const updatedVerification = {
      ...(user?.contact_verification || {}),
      emailVerified: true,
      emailVerifiedAt: now,
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ contact_verification: updatedVerification })
      .eq('id', session.userId);

    if (updateError) throw updateError;

    // 4. Delete the used code
    await supabase.from('verification_codes').delete().eq('id', verificationEntry.id);

    // 5. Renew session cookie with verified status
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
    });

    setSessionCookie(response, createSessionPayload({
      userId: user.id,
      role: user.role,
      email: user.email,
      emailVerified: true
    }));

    return response;
  } catch (error) {
    console.error('[POST /api/auth/verify]', error);
    return NextResponse.json({ success: false, message: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
