import { NextResponse } from 'next/server';
import { scryptSync, timingSafeEqual } from 'crypto';
import { getDatabase } from '@/lib/db/mongodb';
import { createSessionPayload, setSessionCookie } from '@/lib/auth/session';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

function verifyPassword(password, salt, expectedHash) {
  const hashBuffer = scryptSync(password, salt, 64);
  const expectedHashBuffer = Buffer.from(expectedHash, 'hex');

  if (hashBuffer.length !== expectedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, expectedHashBuffer);
}

function toSafeUser(user) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const password = body?.password || '';

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with this email.' }, { status: 404 });
    }

    if (!user.passwordHash || !user.passwordSalt) {
      return NextResponse.json({ success: false, message: 'This account cannot be used for password login.' }, { status: 400 });
    }

    const isPasswordValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
    }

    const safeUser = toSafeUser(user);
    const response = NextResponse.json({
      success: true,
      user: safeUser,
    });

    setSessionCookie(
      response,
      createSessionPayload({ userId: safeUser.id, role: safeUser.role, email: safeUser.email })
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to login right now.' },
      { status: 500 }
    );
  }
}
