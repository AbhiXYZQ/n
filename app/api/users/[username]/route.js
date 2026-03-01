import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { mockUsers } from '@/lib/db/schema';

export async function GET(request, { params }) {
  try {
    const username = String(params?.username || '').trim().toLowerCase();
    if (!username) {
      return NextResponse.json({ success: false, message: 'Username is required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });

    if (user) {
      const { passwordHash, passwordSalt, _id, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    const mockUser = mockUsers.find((item) => item.username === username);
    if (mockUser) {
      return NextResponse.json({ success: true, user: mockUser });
    }

    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unable to fetch profile right now.' }, { status: 500 });
  }
}
