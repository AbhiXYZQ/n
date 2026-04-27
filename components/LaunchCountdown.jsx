'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket } from 'lucide-react';

// ── Set your launch date here ──────────────────────────────────
const LAUNCH_DATE = new Date('2026-06-01T00:00:00+05:30');

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = LAUNCH_DATE - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);
  return { days, hours, minutes, seconds };
}

export default function LaunchCountdown() {
  const [time, setTime]         = useState(null);
  const [dismissed, setDismiss] = useState(false);

  // Dismiss persists in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('nainix_countdown_dismissed') === '1') {
      setDismiss(true);
    }
    setTime(getTimeLeft());
  }, []);

  useEffect(() => {
    if (dismissed || !time) return;
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [dismissed, time]);

  const dismiss = () => {
    setDismiss(true);
    localStorage.setItem('nainix_countdown_dismissed', '1');
  };

  // Hide after launch or if dismissed
  if (dismissed || !time) return null;

  const units = [
    { label: 'Days',    value: pad(time.days) },
    { label: 'Hours',   value: pad(time.hours) },
    { label: 'Mins',    value: pad(time.minutes) },
    { label: 'Secs',    value: pad(time.seconds) },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full overflow-hidden"
      >
        <div className="relative w-full bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">

          {/* Label */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-medium">
            <Rocket className="h-3.5 w-3.5 text-primary animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline">Full platform launch in</span>
            <span className="sm:hidden">Launching in</span>
          </div>

          {/* Countdown tiles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {units.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="relative min-w-[44px] sm:min-w-[52px] h-10 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {/* Subtle shimmer on seconds */}
                  {label === 'Secs' && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5"
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <motion.span
                    key={value}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative z-10 text-lg sm:text-xl font-black text-white tabular-nums"
                  >
                    {value}
                  </motion.span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-white/5"
            aria-label="Dismiss countdown"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
