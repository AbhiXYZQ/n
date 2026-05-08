'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Briefcase, FileText,
  Settings, LogOut, ExternalLink, Menu, X, Shield
} from 'lucide-react';

const navItems = [
  { label: 'Overview',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',     href: '/admin/users',      icon: Users },
  { label: 'Jobs',      href: '/admin/jobs',       icon: Briefcase },
  { label: 'Proposals', href: '/admin/proposals',  icon: FileText },
  { label: 'Settings',  href: '/admin/settings',   icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]   = useState(false);
  const [admin, setAdmin] = useState({ name: 'Admin', email: '' });

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.user) setAdmin({ name: d.user.name || 'Admin', email: d.user.email || '' }); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const currentLabel = navItems.find(n => isActive(n.href))?.label || 'Admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">

      {/* ── Sidebar (desktop) ───────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/6 bg-[#0d0d0d] fixed inset-y-0 left-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-white/6">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Nainix</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive(href)
                  ? 'bg-violet-600/15 text-white border border-violet-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/4'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-white/6 space-y-0.5">
          <Link href="/" target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-white/4 transition-all">
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span>View Site</span>
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>

        {/* Admin info */}
        <div className="px-4 py-3 border-t border-white/6">
          <p className="text-xs font-medium text-white truncate">{admin.name}</p>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{admin.email}</p>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ───────────────────────── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-56 bg-[#0d0d0d] border-r border-white/6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-sm font-bold">Nainix Admin</p>
              </div>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <nav className="flex-1 py-3 px-2 space-y-0.5">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive(href)
                      ? 'bg-violet-600/15 text-white border border-violet-500/20'
                      : 'text-slate-500 hover:text-white hover:bg-white/4'
                  }`}>
                  <Icon className="w-4 h-4" /><span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="px-2 py-3 border-t border-white/6">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400 transition-all">
                <LogOut className="w-4 h-4" /><span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:pl-56 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-14 border-b border-white/6 bg-[#0a0a0a] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <h1 className="text-sm font-semibold text-white">{currentLabel}</h1>
          </div>
          <span className="text-xs text-slate-600 hidden sm:block">Nainix Admin</span>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
