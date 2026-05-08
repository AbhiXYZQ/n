'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, Star, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUSES  = ['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'];
const PAGE_SIZE = 20;
const STATUS_COLOR = {
  OPEN:        'text-emerald-400 bg-emerald-500/10',
  IN_PROGRESS: 'text-amber-400 bg-amber-500/10',
  COMPLETED:   'text-blue-400 bg-blue-500/10',
};

export default function AdminJobsPage() {
  const [jobs, setJobs]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('ALL');
  const [page, setPage]       = useState(1);
  const [toast, setToast]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: PAGE_SIZE,
        ...(search           && { search }),
        ...(status !== 'ALL' && { status }),
      });
      const res  = await fetch(`/api/admin/jobs?${params}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) { setJobs(data.jobs); setTotal(data.total); }
    } finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleAction = async (action, job) => {
    if (action === 'delete' && !confirm(`Delete "${job.title}"?`)) return;
    const res  = await fetch(`/api/admin/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    showToast(data.message || 'Done');
    fetchJobs();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Jobs</h2>
          <p className="text-xs text-slate-600 mt-0.5">{total.toLocaleString()} total</p>
        </div>
        <button onClick={fetchJobs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-slate-400 text-xs hover:text-white hover:border-white/15 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {toast && (
        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">{toast}</div>
      )}

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search job title…"
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/3 border border-white/8 text-white text-sm placeholder-slate-700 outline-none focus:border-white/20 transition-all" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-sm text-slate-400 outline-none cursor-pointer">
          {STATUSES.map(s => <option key={s} value={s} className="bg-[#0d0d0d]">{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Title', 'Client', 'Budget', 'Status', 'Props', 'Posted', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] text-slate-600 font-medium uppercase tracking-widest px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-5 rounded bg-white/3 animate-pulse" /></td></tr>
              )) : !jobs.length ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-600">No jobs found.</td></tr>
              ) : jobs.map(job => (
                <tr key={job.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {job.is_featured && <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                      <span className="text-white text-sm font-medium truncate max-w-[160px]">{job.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs truncate max-w-[100px]">{job.client?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs whitespace-nowrap">
                    ₹{(job.budget_min || 0).toLocaleString('en-IN')}–{(job.budget_max || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUS_COLOR[job.status] || 'text-slate-400 bg-white/5'}`}>
                      {job.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-slate-500 text-xs">{job.proposal_count ?? 0}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs whitespace-nowrap">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction('feature', job)} title={job.is_featured ? 'Unfeature' : 'Feature'}
                        className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center hover:bg-amber-500/15 hover:text-amber-400 text-slate-500 transition-all">
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleAction('delete', job)} title="Delete"
                        className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center hover:bg-red-500/15 hover:text-red-400 text-slate-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
            <p className="text-xs text-slate-600">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-30 transition-all">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500 px-2">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-30 transition-all">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
