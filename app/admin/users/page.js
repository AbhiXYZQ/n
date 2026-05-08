'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, Trash2, UserCheck, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const ROLES    = ['ALL', 'CLIENT', 'FREELANCER', 'ADMIN'];
const PAGE_SIZE = 20;

const ROLE_COLOR = {
  CLIENT:     'text-sky-400 bg-sky-500/10',
  FREELANCER: 'text-violet-400 bg-violet-500/10',
  ADMIN:      'text-red-400 bg-red-500/10',
};

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState('ALL');
  const [page, setPage]       = useState(1);
  const [toast, setToast]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: PAGE_SIZE,
        ...(search           && { search }),
        ...(role !== 'ALL'   && { role }),
      });
      const res  = await fetch(`/api/admin/users?${params}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) { setUsers(data.users); setTotal(data.total); }
    } finally { setLoading(false); }
  }, [page, search, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (action, user) => {
    if (action === 'delete' && !confirm(`Delete ${user.email}?`)) return;
    const isDelete = action === 'delete';
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: isDelete ? 'DELETE' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      ...(isDelete ? {} : { body: JSON.stringify({ action }) }),
    });
    const data = await res.json();
    showToast(data.message || 'Done');
    fetchUsers();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Users</h2>
          <p className="text-xs text-slate-600 mt-0.5">{total.toLocaleString()} total</p>
        </div>
        <button onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-slate-400 text-xs hover:text-white hover:border-white/15 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          {toast}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email…"
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/3 border border-white/8 text-white text-sm placeholder-slate-700 outline-none focus:border-white/20 transition-all" />
        </div>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-sm text-slate-400 outline-none focus:border-white/20 cursor-pointer">
          {ROLES.map(r => <option key={r} value={r} className="bg-[#0d0d0d]">{r === 'ALL' ? 'All Roles' : r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] text-slate-600 font-medium uppercase tracking-widest px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-5 rounded bg-white/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : !users.length ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-xs text-slate-600">No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-2.5">
                    <p className="text-white text-sm font-medium truncate max-w-[130px]">{u.name || '—'}</p>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs truncate max-w-[160px]">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${ROLE_COLOR[u.role] || 'text-slate-400 bg-white/5'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {u.email_verified
                      ? <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle className="w-3 h-3" /> Yes</span>
                      : <span className="flex items-center gap-1 text-slate-600 text-xs"><XCircle className="w-3 h-3" /> No</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs whitespace-nowrap">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction('verify', u)} title="Force Verify"
                        className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center hover:bg-emerald-500/15 hover:text-emerald-400 text-slate-500 transition-all">
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleAction('delete', u)} title="Delete"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
            <p className="text-xs text-slate-600">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
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
