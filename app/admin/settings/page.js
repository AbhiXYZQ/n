'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [launchDate, setLaunchDate] = useState('2026-06-01');
  const [siteMode, setSiteMode]     = useState('coming_soon');
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState(null); // { ok, text }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const res  = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ launchDate, siteMode }),
      });
      const data = await res.json();
      setMsg({ ok: data.success, text: data.message || (data.success ? 'Saved.' : 'Failed.') });
    } catch { setMsg({ ok: false, text: 'Network error.' }); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-xs text-slate-600 mt-0.5">Platform configuration</p>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs border ${
          msg.ok
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {msg.ok ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={save} className="space-y-4">

        {/* Site Mode */}
        <div className="rounded-xl border border-white/6 bg-white/2 p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Site Mode</p>
          <p className="text-xs text-slate-600">Controls what visitors see on the public site.</p>
          <div className="flex gap-2">
            {[
              { val: 'coming_soon', label: 'Coming Soon' },
              { val: 'live',        label: 'Live' },
            ].map(opt => (
              <button key={opt.val} type="button" onClick={() => setSiteMode(opt.val)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                  siteMode === opt.val
                    ? 'bg-violet-600/20 border-violet-500/30 text-white'
                    : 'bg-white/3 border-white/8 text-slate-500 hover:text-white hover:border-white/15'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Date */}
        <div className="rounded-xl border border-white/6 bg-white/2 p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Launch Date</p>
          <p className="text-xs text-slate-600">Countdown target on the Coming Soon page.</p>
          <input type="date" value={launchDate} onChange={e => setLaunchDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/3 border border-white/8 text-white text-sm outline-none focus:border-white/20 transition-all [color-scheme:dark]" />
        </div>

        {/* Preview URL */}
        <div className="rounded-xl border border-white/6 bg-white/2 p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Preview URL</p>
          <p className="text-xs text-slate-600">Access site while in Coming Soon mode:</p>
          <code className="block text-xs text-violet-400 bg-violet-500/8 border border-violet-500/15 rounded-lg px-3 py-2 break-all">
            https://www.nainix.me/api/preview?secret=nainix_owner_2026
          </code>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
