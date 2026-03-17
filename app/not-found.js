'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Search, Briefcase, ArrowLeft, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Quick links shown on 404 page
const QUICK_LINKS = [
  {
    icon: Home,
    label: 'Home',
    desc: 'Back to landing page',
    href: '/',
  },
  {
    icon: Briefcase,
    label: 'Browse Jobs',
    desc: 'Find freelance work',
    href: '/jobs',
  },
  {
    icon: Search,
    label: 'Collab',
    desc: 'Find project partners',
    href: '/collab',
  },
];

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 text-center">
      {/* Animated 404 number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="relative select-none"
      >
        {/* Giant blurred glow behind the number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-72 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <h1 className="relative text-[9rem] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent">
          404
        </h1>
      </motion.div>

      {/* Icon + message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-4 space-y-3"
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Frown className="h-5 w-5" />
          <p className="text-lg font-medium">Page not found</p>
        </div>
        <p className="max-w-md text-muted-foreground text-sm">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
      </motion.div>

      {/* Quick navigation cards */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-lg"
      >
        {QUICK_LINKS.map(({ icon: Icon, label, desc, href }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full border transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/10">
              <CardContent className="flex flex-col items-center gap-2 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </motion.div>

      {/* Brand watermark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-12 text-xs text-muted-foreground"
      >
        Lost on{' '}
        <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Nainix
        </span>
        ? We'll help you find your way.
      </motion.p>
    </div>
  );
}
