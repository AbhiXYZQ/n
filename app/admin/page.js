'use client';

import { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, RefreshCw, UserCheck, Clock } from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, loading }) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-widest">{label}</p>
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      {loading
        ? <div className="h-7 w-20 rounded bg-white/5 animate-pulse" />
        : <p className="text-2xl font-bold text-white tabular-nums">{value ?? '—'}</p>
      }
      {sub && !loading && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

const ROLE_COLOR = {
  CLIENT:     'text-sky-400 bg-sky-500/10',
  FREELANCER: 'text-violet-400 bg-violet-500/10',
  ADMIN:      'text-red-400 bg-red-500/10',
};

export default function AdminOverviewPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/stats?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) { setStats(data); setUpdated(new Date()); }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const cards = [
    { label: 'Total Users',     value: stats?.totalUsers,     sub: `${stats?.newUsersToday ?? 0} in last 24h`, icon: Users },
    { label: 'Total Jobs',      value: stats?.totalJobs,      sub: `${stats?.openJobs ?? 0} open`,            icon: Briefcase },
    { label: 'Total Proposals', value: stats?.totalProposals, sub: 'Across all jobs',                          icon: FileText },
    { label: 'Waitlist',        value: stats?.waitlistCount,  sub: 'Pre-launch signups',                       icon: UserCheck },
  ];

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Platform Overview</h2>
          {updated && (
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated {updated.toLocaleTimeString('en-IN')}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-slate-400 text-xs hover:text-white hover:border-white/15 transition-all disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <StatCard key={i} {...c} loading={loading} />
        ))}
      </div>

      {/* Recent Signups */}
      <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/6">
          <p className="text-sm font-semibold text-white">Recent Signups</p>
          <p className="text-xs text-slate-600 mt-0.5">Last 10 users who joined</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/4">
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left text-[11px] text-slate-600 font-medium uppercase tracking-widest px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-4 py-3">
                      <div className="h-5 rounded bg-white/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : !stats?.recentUsers?.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-600">
                    No users yet.
                  </td>
                </tr>
              ) : (
                stats.recentUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="text-sm text-white font-medium truncate max-w-[140px]">{u.name || '—'}</p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs truncate max-w-[180px]">{u.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${ROLE_COLOR[u.role] || 'text-slate-400 bg-white/5'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
