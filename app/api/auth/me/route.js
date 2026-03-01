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
