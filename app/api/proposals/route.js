import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '@/lib/db/mongodb';
import { getSessionFromRequest } from '@/lib/auth/session';
import { mockProposals } from '@/lib/db/schema';

let proposalsIndexesInitialized = false;

async function ensureProposalsIndexes(proposalsCollection) {
  if (proposalsIndexesInitialized) return;
  await proposalsCollection.createIndex({ id: 1 }, { unique: true });
  await proposalsCollection.createIndex({ freelancerId: 1, createdAt: -1 });
  await proposalsCollection.createIndex({ jobId: 1, createdAt: -1 });
  proposalsIndexesInitialized = true;
}

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const proposalsCollection = db.collection('proposals');
    const jobsCollection = db.collection('jobs');
    const usersCollection = db.collection('users');

    await ensureProposalsIndexes(proposalsCollection);

    const user = await usersCollection.findOne({ id: session.userId });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    let query = {};
    if (user.role === 'FREELANCER') {
      query = { freelancerId: user.id };
    } else if (user.role === 'CLIENT') {
      const myJobs = await jobsCollection.find({ clientId: user.id }).project({ id: 1 }).toArray();
      const myJobIds = myJobs.map((job) => job.id);
      query = { jobId: { $in: myJobIds } };
    }

    const proposals = await proposalsCollection.find(query).sort({ createdAt: -1 }).toArray();
    if (proposals.length === 0 && user.role === 'FREELANCER') {
      const fallback = mockProposals.filter((proposal) => proposal.freelancerId === user.id);
      return NextResponse.json({ success: true, proposals: fallback });
    }

    const normalizedProposals = proposals.map(({ _id, ...proposal }) => proposal);
    return NextResponse.json({ success: true, proposals: normalizedProposals });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to fetch proposals right now.' }, { status: 500 });
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
    const jobsCollection = db.collection('jobs');
    const proposalsCollection = db.collection('proposals');

    const user = await usersCollection.findOne({ id: session.userId });
    if (!user || user.role !== 'FREELANCER') {
      return NextResponse.json({ success: false, message: 'Only freelancers can submit proposals.' }, { status: 403 });
    }

    const body = await request.json();
    const jobId = body?.jobId;
    const pitch = body?.pitch?.trim();
    const estimatedDays = Number(body?.estimatedDays || 0);
    const price = Number(body?.price || 0);

    if (!jobId || !pitch || estimatedDays <= 0 || price <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid proposal payload.' }, { status: 400 });
    }

    const job = await jobsCollection.findOne({ id: jobId });
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
    }

    await ensureProposalsIndexes(proposalsCollection);

    const proposal = {
      id: uuidv4(),
      jobId,
      freelancerId: user.id,
      pitch: pitch.slice(0, 300),
      estimatedDays,
      price,
      smartMatchScore: Math.floor(Math.random() * 20) + 80,
      createdAt: new Date().toISOString(),
    };

    await proposalsCollection.insertOne(proposal);

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to submit proposal right now.' }, { status: 500 });
  }
}
