import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizeUsername = (username = '') => username.trim().toLowerCase();

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone = '') {
  return /^\+?[1-9]\d{7,14}$/.test(phone.replace(/[\s-]/g, ''));
}

function isValidUsername(username = '') {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const rawValue = searchParams.get('value') || '';

    if (!type || !rawValue.trim()) {
      return NextResponse.json({ success: false, message: 'Type and value are required.' }, { status: 400 });
    }

    if (!['email', 'username', 'phone'].includes(type)) {
      return NextResponse.json({ success: false, message: 'Invalid lookup type.' }, { status: 400 });
    }

    let query = {};

    if (type === 'email') {
      const value = normalizeEmail(rawValue);
      if (!isValidEmail(value)) {
        return NextResponse.json({ success: true, available: false, reason: 'invalid', message: 'Invalid email format.' });
      }
      query = { email: value };
    }

    if (type === 'username') {
      const value = normalizeUsername(rawValue);
      if (!isValidUsername(value)) {
        return NextResponse.json({ success: true, available: false, reason: 'invalid', message: 'Use 3-20 chars: lowercase letters, numbers, underscore.' });
      }
      query = { username: value };
    }

    if (type === 'phone') {
      const value = rawValue.trim();
      if (!isValidPhone(value)) {
        return NextResponse.json({ success: true, available: false, reason: 'invalid', message: 'Invalid phone format.' });
      }
      query = { phone: value };
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const existing = await usersCollection.findOne(query, { projection: { _id: 1 } });

    if (existing) {
      return NextResponse.json({ success: true, available: false, reason: 'taken', message: `${type} already in use.` });
    }

    return NextResponse.json({ success: true, available: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to check availability right now.' }, { status: 500 });
  }
}
