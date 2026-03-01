import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const session = getSessionFromRequest(request);
    const role = body?.role;
    const jobId = body?.jobId;
    const featuredDays = Number(body?.featuredDays || 3);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'jobId is required.' }, { status: 400 });
    }

    if (![1, 3].includes(featuredDays)) {
      return NextResponse.json({ success: false, message: 'featuredDays must be 1 or 3.' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const jobsCollection = db.collection('jobs');

    const user = await usersCollection.findOne({ id: session.userId });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    if (role && user.role !== role) {
      return NextResponse.json({ success: false, message: 'Role mismatch for this account.' }, { status: 403 });
    }

    if (user.role !== 'CLIENT') {
      return NextResponse.json({ success: false, message: 'Only clients can feature jobs.' }, { status: 403 });
    }

    const job = await jobsCollection.findOne({ id: jobId });
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
    }

    if (job.clientId !== user.id) {
      return NextResponse.json({ success: false, message: 'You can only feature your own jobs.' }, { status: 403 });
    }

    await jobsCollection.updateOne(
      { id: jobId },
      {
        $set: {
          isFeatured: true,
          featuredUntil: new Date(Date.now() + featuredDays * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      jobId,
      featuredDays,
      featuredUntil: new Date(Date.now() + featuredDays * 86400000).toISOString(),
      amountUsd: featuredDays === 1 ? 9 : 19,
      status: 'PAID_MOCK',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to feature this job right now.' },
      { status: 500 }
    );
  }
}
