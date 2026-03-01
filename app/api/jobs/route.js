import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '@/lib/db/mongodb';
import { getSessionFromRequest } from '@/lib/auth/session';
import { JobStatus, mockJobs } from '@/lib/db/schema';

let jobsIndexesInitialized = false;

async function ensureJobsIndexes(jobsCollection) {
  if (jobsIndexesInitialized) return;
  await jobsCollection.createIndex({ id: 1 }, { unique: true });
  await jobsCollection.createIndex({ clientId: 1, createdAt: -1 });
  jobsIndexesInitialized = true;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const jobsCollection = db.collection('jobs');
    await ensureJobsIndexes(jobsCollection);

    const jobs = await jobsCollection.find({}).sort({ createdAt: -1 }).toArray();
    if (jobs.length === 0) {
      return NextResponse.json({ success: true, jobs: mockJobs });
    }

    const normalizedJobs = jobs.map(({ _id, ...job }) => job);
    return NextResponse.json({ success: true, jobs: normalizedJobs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to fetch jobs right now.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ id: session.userId });

    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json({ success: false, message: 'Only clients can create jobs.' }, { status: 403 });
    }

    const body = await request.json();
    const title = body?.title?.trim();
    const description = body?.description?.trim();
    const category = body?.category;
    const budgetMin = Number(body?.budgetMin || 0);
    const budgetMax = Number(body?.budgetMax || 0);
    const requiredSkills = Array.isArray(body?.requiredSkills)
      ? body.requiredSkills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
    const isUrgent = !!body?.isUrgent;
    const isFeatured = !!body?.isFeatured;
    const featuredDays = Number(body?.featuredDays || 0);

    if (!title || !description || !category || budgetMin <= 0 || budgetMax <= 0 || requiredSkills.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid job payload.' }, { status: 400 });
    }

    if (budgetMin > budgetMax) {
      return NextResponse.json({ success: false, message: 'Budget min cannot exceed budget max.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const job = {
      id: uuidv4(),
      clientId: user.id,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      isUrgent,
      requiredSkills,
      isFeatured,
      featuredUntil: isFeatured && [1, 3].includes(featuredDays)
        ? new Date(Date.now() + featuredDays * 86400000).toISOString()
        : null,
      status: JobStatus.OPEN,
      createdAt: now,
      updatedAt: now,
    };

    const jobsCollection = db.collection('jobs');
    await ensureJobsIndexes(jobsCollection);
    await jobsCollection.insertOne(job);

    return NextResponse.json({ success: true, job });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to create job right now.' }, { status: 500 });
  }
}
