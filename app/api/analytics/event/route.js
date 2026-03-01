import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const eventName = body?.eventName;
    const payload = body?.payload || {};

    if (!eventName) {
      return NextResponse.json({ success: false, message: 'eventName is required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const analyticsCollection = db.collection('analytics_events');

    await analyticsCollection.insertOne({
      eventName,
      payload,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to record event.' }, { status: 500 });
  }
}
