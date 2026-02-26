import { NextResponse } from 'next/server';
import { randomBytes, scryptSync } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '@/lib/db/mongodb';

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizeUsername = (username = '') => username.trim().toLowerCase();

let indexesInitialized = false;

async function ensureIndexes(usersCollection) {
  if (indexesInitialized) {
    return;
  }

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  indexesInitialized = true;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function toSafeUser(user) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = normalizeEmail(body?.email);
    const username = normalizeUsername(body?.username);
    const password = body?.password || '';
    const role = body?.role;

    if (!name || !email || !username || !password || !role) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (!['CLIENT', 'FREELANCER'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role selected.' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    await ensureIndexes(usersCollection);

    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ success: false, message: 'Email is already registered.' }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: 'Username is already taken.' }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);

    const newUser = {
      id: uuidv4(),
      role,
      name,
      email,
      username,
      bio: '',
      verifiedBadges: [],
      socialLinks: {},
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      skills: [],
      portfolio: [],
      videoIntro: null,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: toSafeUser(newUser),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to create account right now.' },
      { status: 500 }
    );
  }
}
