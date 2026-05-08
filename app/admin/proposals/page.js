'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;
const STATUS_COLOR = {
  PENDING:     'text-amber-400 bg-amber-500/10',
  ACCEPTED:    'text-emerald-400 bg-emerald-500/10',
  REJECTED:    'text-slate-400 bg-white/5',
  SHORTLISTED: 'text-blue-400 bg-blue-500/10',
};

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE, ...(search && { search }) });
      const res = await fetch(`/api/admin/proposals?${params}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) { setProposals(data.proposals); setTotal(data.total); }
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Proposals</h2>
          <p className="text-xs text-slate-600 mt-0.5">{total.toLocaleString()} total</p>
        </div>
        <button onClick={fetchProposals}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-slate-400 text-xs hover:text-white hover:border-white/15 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by cover letter…"
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/3 border border-white/8 text-white text-sm placeholder-slate-700 outline-none focus:border-white/20 transition-all" />
      </div>

      <div className="rounded-xl border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Freelancer', 'Job', 'Bid', 'Delivery', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-[11px] text-slate-600 font-medium uppercase tracking-widest px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-5 rounded bg-white/3 animate-pulse" /></td></tr>
              )) : !proposals.length ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-xs text-slate-600">No proposals found.</td></tr>
              ) : proposals.map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-2.5 text-white text-sm font-medium">{p.freelancer?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs truncate max-w-[160px]">{p.job?.title || '—'}</td>
                  <td className="px-4 py-2.5 text-emerald-400 text-sm font-semibold">₹{(p.bid_amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{p.delivery_days ? `${p.delivery_days}d` : '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${STATUS_COLOR[p.status] || 'text-slate-400 bg-white/5'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs whitespace-nowrap">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
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
