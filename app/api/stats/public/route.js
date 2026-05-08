import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();

    // Fetch counts in parallel
    const [
      usersCount,
      freelancersCount,
      jobsCount,
      recentJobs
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'FREELANCER'),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'OPEN'),
      supabase.from('jobs')
        .select('title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: usersCount.count || 0,
        totalFreelancers: freelancersCount.count || 0,
        openJobs: jobsCount.count || 0,
        recentActivity: (recentJobs.data || []).map(j => ({
          type: 'JOB',
          title: j.title,
          category: j.category,
          time: j.created_at
        }))
      }
    });
  } catch (error) {
    console.error('[GET /api/stats/public]', error);
    return NextResponse.json({ 
      success: false, 
      stats: { 
        totalUsers: 0, 
        totalFreelancers: 0, 
        openJobs: 0, 
        recentActivity: [] 
      } 
    });
  }
}
