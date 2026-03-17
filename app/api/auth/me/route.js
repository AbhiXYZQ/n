import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { getSessionFromRequest } from '@/lib/auth/session';

function toSafeUser(user) {
  const { passwordHash, passwordSalt, _id, ...safeUser } = user;
  return safeUser;
}

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ id: session.userId });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to fetch session user.' }, { status: 500 });
  }
}

// ─── PATCH /api/auth/me — Update profile ────────────────────
export async function PATCH(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Whitelist only safe fields that can be updated
    const allowedFields = [
      'name',
      'bio',
      'avatarUrl',
      'city',
      'state',
      'country',
      'professionalTitle',
      'hourlyRate',
      'experienceYears',
      'availability',
      'skills',
      'portfolioUrl',
      'videoIntro',
      'socialLinks',     // { github, linkedin, whatsapp }
      'portfolio',       // [{ title, description, image }]
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update.' }, { status: 400 });
    }

    updates.updatedAt = new Date().toISOString();

    const db = await getDatabase();
    const result = await db.collection('users').findOneAndUpdate(
      { id: session.userId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: toSafeUser(result) });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to update profile.' }, { status: 500 });
  }
}
