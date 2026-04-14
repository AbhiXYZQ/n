import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest } from '@/lib/auth/session';
import { mockCollabRooms } from '@/lib/db/schema';

export async function GET() {
  try {
    const supabase = getSupabase();
    
    // Fetch all collab rooms with creator info
    const { data: rooms, error } = await supabase
      .from('collab_rooms')
      .select(`
        *,
        creator:users (
          id,
          name,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[GET /api/collab] Supabase fetch error, using fallback:', error.message);
      // Fallback to mock data if database is not ready
      return NextResponse.json({ success: true, collabRooms: mockCollabRooms });
    }

    // Normalize data (mapping creator back to a flat structure if needed, 
    // or keep it as is. The frontend expects creatorId and uses getCreator helper, 
    // but we can make it better by returning the creator object directly)
    const normalizedRooms = (rooms || []).map(r => ({
      ...r,
      // Ensure camelCase for frontend consistency
      creatorId: r.creator_id,
      createdAt: r.created_at,
      // If we joined creator, we can use it to avoid extra lookups on frontend
      creator: r.creator ? {
        id: r.creator.id,
        name: r.creator.name,
        username: r.creator.username,
        avatarUrl: r.creator.avatar_url
      } : null
    }));

    return NextResponse.json({ success: true, collabRooms: normalizedRooms });
  } catch (error) {
    console.error('[GET /api/collab] Fatal error:', error);
    return NextResponse.json({ success: true, collabRooms: mockCollabRooms });
  }
}

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, requiredRole, description } = body;

    if (!title?.trim() || !requiredRole?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    const newRoom = {
      id: uuidv4(),
      creator_id: session.userId,
      title: title.trim(),
      required_role: requiredRole.trim(),
      description: description.trim(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('collab_rooms').insert(newRoom);

    if (error) {
      console.error('[POST /api/collab] Supabase insert error:', error.message);
      return NextResponse.json({ success: false, message: 'Failed to save collab post to database.' }, { status: 500 });
    }

    // Fetch the room back with creator info to return a complete object
    const { data: roomWithCreator } = await supabase
      .from('collab_rooms')
      .select('*, creator:users(id, name, username, avatar_url)')
      .eq('id', newRoom.id)
      .maybeSingle();

    const normalizedRoom = {
      ...roomWithCreator,
      creatorId: roomWithCreator.creator_id,
      createdAt: roomWithCreator.created_at,
      creator: roomWithCreator.creator ? {
        id: roomWithCreator.creator.id,
        name: roomWithCreator.creator.name,
        username: roomWithCreator.creator.username,
        avatarUrl: roomWithCreator.creator.avatar_url
      } : null
    };

    return NextResponse.json({ success: true, collab: normalizedRoom });
  } catch (error) {
    console.error('[POST /api/collab] Fatal error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
