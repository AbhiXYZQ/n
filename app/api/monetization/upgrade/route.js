import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest } from '@/lib/auth/session';

const ALLOWED_FEATURES = ['VERIFICATION_BADGE', 'AI_PRO'];

export async function POST(request) {
  return NextResponse.json({ 
    success: false, 
    message: 'This endpoint is deprecated. Please use the /api/payment/razorpay flow for secure payments.' 
  }, { status: 410 }); // 410 Gone
}
