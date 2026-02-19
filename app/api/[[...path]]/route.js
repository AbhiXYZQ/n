import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'Nainix API is running!' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
