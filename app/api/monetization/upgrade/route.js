import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { getSessionFromRequest } from '@/lib/auth/session';

const ALLOWED_FEATURES = ['VERIFICATION_BADGE', 'AI_PRO'];

function normalizeFeature(feature = '') {
  return String(feature).trim().toUpperCase();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const session = getSessionFromRequest(request);
    const role = body?.role;
    const feature = normalizeFeature(body?.feature);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!feature) {
      return NextResponse.json({ success: false, message: 'feature is required.' }, { status: 400 });
    }

    if (!['CLIENT', 'FREELANCER'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role.' }, { status: 400 });
    }

    if (!ALLOWED_FEATURES.includes(feature)) {
      return NextResponse.json({ success: false, message: 'Invalid upgrade feature.' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('billing_transactions');

    const user = await usersCollection.findOne({ id: session.userId });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    if (role && user.role !== role) {
      return NextResponse.json({ success: false, message: 'Role mismatch for this account.' }, { status: 403 });
    }

    if (feature === 'AI_PRO' && user.role !== 'FREELANCER') {
      return NextResponse.json({ success: false, message: 'AI Pro is available for freelancers only.' }, { status: 403 });
    }

    const existingMonetization = user.monetization || {
      plan: 'FREE',
      verificationBadgeActive: false,
      aiProActive: false,
      aiProActivatedAt: null,
    };

    const now = new Date().toISOString();
    let updatedMonetization = { ...existingMonetization };
    let updatedBadges = [...(user.verifiedBadges || [])];
    let amountUsd = 0;

    if (feature === 'VERIFICATION_BADGE') {
      updatedMonetization.verificationBadgeActive = true;
      amountUsd = 12;
      if (!updatedBadges.includes('Verified User')) {
        updatedBadges.push('Verified User');
      }
    }

    if (feature === 'AI_PRO') {
      updatedMonetization.plan = 'AI_PRO';
      updatedMonetization.aiProActive = true;
      updatedMonetization.aiProActivatedAt = now;
      amountUsd = 19;
    }

    await usersCollection.updateOne(
      { id: userId },
      {
        $set: {
          monetization: updatedMonetization,
          verifiedBadges: updatedBadges,
          updatedAt: now,
        },
      }
    );

    await transactionsCollection.insertOne({
      userId: user.id,
      role: user.role,
      feature,
      amountUsd,
      currency: 'USD',
      status: 'PAID_MOCK',
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      monetization: updatedMonetization,
      verifiedBadges: updatedBadges,
      transaction: {
        feature,
        amountUsd,
        status: 'PAID_MOCK',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to process upgrade right now.' },
      { status: 500 }
    );
  }
}
