import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      feature,
      amount // in INR (not paise)
    } = await request.json();

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Grant the feature in DB
    const supabase = getSupabase();
    const now = new Date().toISOString();
    let message = 'Feature granted successfully';

    if (feature === 'VERIFICATION_BADGE' || feature === 'AI_PRO') {
      const { data: user } = await supabase
        .from('users')
        .select('monetization, verified_badges, role')
        .eq('id', session.userId)
        .single();

      if (user) {
        let updatedMonetization = { ...(user.monetization || {}) };
        let updatedBadges = [...(user.verified_badges || [])];

        if (feature === 'VERIFICATION_BADGE') {
          updatedMonetization.verificationBadgeActive = true;
          if (!updatedBadges.includes('Verified User')) updatedBadges.push('Verified User');
        } else if (feature === 'AI_PRO') {
          updatedMonetization.plan = 'AI_PRO';
          updatedMonetization.aiProActive = true;
          updatedMonetization.aiProActivatedAt = now;
        }

        await supabase
          .from('users')
          .update({ 
            monetization: updatedMonetization, 
            verified_badges: updatedBadges,
            updated_at: now 
          })
          .eq('id', session.userId);
      }
    } else if (feature === 'FEATURED_JOB') {
        // Logic for featured job (requires jobId in request usually)
        // For now, assume feature contains the JOB_ID if passed specially, e.g. "FEATURED_JOB:123"
        const [type, jobId] = feature.split(':');
        if (type === 'FEATURED_JOB' && jobId) {
            await supabase
              .from('jobs')
              .update({ 
                is_featured: true, 
                featured_until: new Date(Date.now() + 3 * 86400000).toISOString(),
                updated_at: now 
              })
              .eq('id', jobId);
        }
    }

    // 3. Log the transaction
    await supabase.from('billing_transactions').insert({
      user_id: session.userId,
      feature: feature,
      amount_paid: amount,
      currency: 'INR',
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      status: 'PAID',
      created_at: now
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('[Razorpay Verify Error]:', error);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
