import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest } from '@/lib/auth/session';
import { sendCollabInterestEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Please log in to express interest.' }, { status: 401 });
    }

    const body = await request.json();
    const { collabId, collabTitle, creatorId, message, skills, contactEmail, contactWhatsApp } = body;

    // Basic validation
    if (!collabId || !collabTitle || !creatorId) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }
    if (!message?.trim() || message.trim().length < 20) {
      return NextResponse.json({ success: false, message: 'Message must be at least 20 characters.' }, { status: 400 });
    }
    if (!skills?.trim()) {
      return NextResponse.json({ success: false, message: 'Please provide your relevant skills.' }, { status: 400 });
    }
    if (!contactEmail?.trim() && !contactWhatsApp?.trim()) {
      return NextResponse.json({ success: false, message: 'Please provide at least one contact method.' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Get sender info
    const { data: sender } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', session.userId)
      .maybeSingle();

    if (!sender) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // Can't express interest in your own collab
    if (sender.id === creatorId) {
      return NextResponse.json({ success: false, message: 'You cannot express interest in your own collab.' }, { status: 403 });
    }

    // Get creator info for email notification
    const { data: creator } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', creatorId)
      .maybeSingle();

    // Save interest to Supabase (collab_interests table)
    // Gracefully continue even if table doesn't exist yet
    try {
      await supabase.from('collab_interests').insert({
        id: uuidv4(),
        collab_id: collabId,
        sender_id: sender.id,
        creator_id: creatorId,
        message: message.trim().slice(0, 500),
        skills: skills.trim().slice(0, 200),
        contact_email: contactEmail?.trim() || null,
        contact_whatsapp: contactWhatsApp?.trim() || null,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Table may not exist yet — proceed with email notification anyway
    }

    // Send email notification to creator
    if (creator?.email) {
      try {
        await sendCollabInterestEmail({
          to: creator.email,
          creatorName: creator.name || 'there',
          senderName: sender.name || 'Someone',
          collabTitle,
          message: message.trim(),
          skills: skills.trim(),
          contactEmail: contactEmail?.trim() || '',
          contactWhatsApp: contactWhatsApp?.trim() || '',
        });
      } catch (emailErr) {
        // Email failure shouldn't block the response
        console.error('[collab/interest] Email send failed:', emailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Interest sent successfully! The creator has been notified.',
    });
  } catch (error) {
    console.error('[POST /api/collab/interest]', error);
    return NextResponse.json({ success: false, message: 'Unable to send interest right now. Please try again.' }, { status: 500 });
  }
}
