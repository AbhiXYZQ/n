import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { amount, feature, currency = 'INR' } = await request.json();

    if (!amount || !feature) {
      return NextResponse.json({ success: false, message: 'Amount and feature are required' }, { status: 400 });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.userId,
        feature: feature,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('[Razorpay Order Error]:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
