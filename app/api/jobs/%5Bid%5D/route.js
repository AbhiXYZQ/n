import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

function normalizeJob(j) {
  return {
    id            : j.id,
    clientId      : j.client_id,
    client        : j.client || null,
    title         : j.title,
    description   : j.description,
    category      : j.category,
    budgetMin     : j.budget_min,
    budgetMax     : j.budget_max,
    isUrgent      : j.is_urgent,
    isFeatured    : j.is_featured,
    featuredUntil : j.featured_until,
    requiredSkills: j.required_skills || [],
    status        : j.status,
    createdAt     : j.created_at,
    updatedAt     : j.updated_at,
  };
}

function getSafeClient(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    avatar_url: user.avatar_url || user.avatarUrl,
    verified_badges: user.verified_badges || user.verifiedBadges || []
  };
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Job ID is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*, client:users(id, name, avatar_url, verified_badges)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    const normalized = {
      ...normalizeJob(job),
      client: getSafeClient(job.client)
    };

    return NextResponse.json({ success: true, job: normalized });
  } catch (error) {
    console.error('[GET /api/jobs/[id]]', error);
    return NextResponse.json({ success: false, message: 'Unable to fetch job details.' }, { status: 500 });
  }
}
