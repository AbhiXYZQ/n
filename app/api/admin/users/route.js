import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { getSessionFromRequest } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

function isAdmin(req) {
  return getSessionFromRequest(req)?.role === 'ADMIN';
}

// GET /api/admin/users?page=1&limit=15&search=&role=&plan=&verified=
export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit    = Math.min(50, parseInt(searchParams.get('limit') || '15'));
  const search   = searchParams.get('search')   || '';
  const role     = searchParams.get('role')     || '';
  const plan     = searchParams.get('plan')     || '';
  const verified = searchParams.get('verified') || '';
  const from     = (page - 1) * limit;

  try {
    const supabase = getSupabase();
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }
    if (role) query = query.eq('role', role);
    if (plan) query = query.eq('monetization->>plan', plan);

    // email verified is stored inside contact_verification JSONB as emailVerified
    if (verified === 'YES') query = query.eq('contact_verification->>emailVerified', 'true');
    if (verified === 'NO')  query = query.or('contact_verification.is.null,contact_verification->>emailVerified.eq.false');

    query = query.order('created_at', { ascending: false }).range(from, from + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    // Normalize data for frontend
    const users = (data || []).map(u => ({
      ...u,
      email_verified: u.contact_verification?.emailVerified || false,
      plan: u.monetization?.plan || 'FREE',
    }));

    return NextResponse.json({ success: true, users, total: count || 0, page, limit });
  } catch (err) {
    console.error('[Admin Users GET]', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch users.' }, { status: 500 });
  }
}
