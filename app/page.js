'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Zap, Shield, Users, CheckCircle2,
  Code2, BriefcaseBusiness, Star, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockSuccessStories } from '@/lib/db/schema';
import useAuthStore from '@/lib/store/authStore';

// ── Fade-up animation helper ──────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [realStats, setRealStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    openJobs: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch real stats
    fetch('/api/stats/public')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRealStats(data.stats);
        }
      })
      .catch(err => console.error('Failed to fetch public stats:', err));

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Low Commission',
      desc: 'Keep more of what you earn. Plans start at 10% down to just 1% with AI Pro.',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: Users,
      title: 'Direct Contact',
      desc: 'Connect directly with clients — share GitHub, LinkedIn, or WhatsApp. No middlemen.',
      color: 'bg-violet-500/10 text-violet-500',
    },
    {
      icon: Shield,
      title: 'Smart Matching',
      desc: 'AI-powered matching based on your skills. Get ranked proposals with urgent SOS tags.',
      color: 'bg-emerald-500/10 text-emerald-500',
    },
  ];

  const steps = [
    { num: '01', title: 'Identity Verification', desc: 'Secure profile setup with GitHub/LinkedIn validation to ensure only verified developers join.' },
    { num: '02', title: 'Post a Project', desc: 'Clients post projects with technical requirements, budgets, and milestone-based structures.' },
    { num: '03', title: 'AI Matchmaking', desc: 'Our engine analyzes skills and ranks the top experts for every role in seconds.' },
    { num: '04', title: 'Connect & Build', desc: 'Connect directly with zero hidden fees. Work, deliver, and scale with complete freedom.' },
  ];

  const plans = [
    { title: 'Free', fee: '10%', desc: 'Basic direct hiring', highlight: false },
    { title: 'Featured', fee: '8%', desc: 'Visibility boost', highlight: false },
    { title: 'Verified', fee: '4%', desc: 'Trusted badge', highlight: false },
    { title: 'AI Pro', fee: '1%', desc: 'Ultimate tools', highlight: true },
  ];

  return (
    <div className="w-full">

      {/* ── Announcement Banner ─────────────────────────────────────────── */}
      <div className="w-full bg-primary/90 text-primary-foreground">
        <Link
          href="/founders"
          className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium group"
        >
          <Zap className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            <strong>Founders Offer:</strong> 0% Commission for the first 100 members.
          </span>
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border min-h-[540px] sm:min-h-[620px] md:min-h-[700px] flex items-center">
        {/* Cover image background */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/homePage_img/cover.png')" }}
        />
        {/* Gradient overlay — deepened for better contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        {/* Subtle primary tint at the top */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />

        <div className="container relative z-10 py-20 sm:py-28 md:py-36">
          <motion.div
            className="mx-auto max-w-3xl text-center space-y-6"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white uppercase tracking-widest">
                <Star className="h-3 w-3 fill-primary" />
                Developer-First Freelance Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={0.05}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white"
            >
              Hire Developers{' '}
              <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">Directly.</span>
              <br />
              <span className="text-white/90 text-3xl sm:text-4xl md:text-5xl font-semibold">
                Or Find Dev Work Fast.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              custom={0.1}
              className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed font-medium"
            >
              Nainix connects clients and developers directly — no middlemen, no bloated commissions.
              Post a project or apply to work today.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              custom={0.15}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-10 text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all duration-300" asChild>
                <Link href="/freelancers">
                  Hire a Developer
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 h-14 px-10 text-base font-bold border border-white/60 text-white bg-white/10 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-xl shadow-xl"
                asChild
              >
                <Link href="/jobs">
                  Find Dev Work
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Secondary link */}
            <motion.div variants={fadeUp} custom={0.2}>
              <Link
                href={isAuthenticated ? '/dashboard' : '/register?role=client'}
                className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Post a Project for free'}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Marketplace Pulse ─────────────────────────────────────────── */}
      <section className="w-full border-y bg-muted/20 py-6 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        </div>
        <div className="container relative z-10">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:pause-marquee cursor-default">
            {(realStats.recentActivity.length > 0 ? realStats.recentActivity : [
              { label: 'Recently Hired', text: 'Full-stack Developer for Fintech SaaS', icon: Code2 },
              { label: 'New Project', text: 'AI Model Integration for Healthcare', icon: Zap },
              { label: 'Verified', text: 'Sr. DevOps Engineer joined from Google', icon: Shield },
              { label: 'Urgent SOS', text: 'React Native Expert needed for 48h sprint', icon: Star },
              { label: 'Community', text: '12 New Collaboration Rooms created', icon: Users },
            ]).map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm shadow-sm"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">{item.label || (item.type === 'JOB' ? 'New Job' : 'Activity')}</span>
                <span className="text-xs font-medium text-foreground/80">{item.text || item.title}</span>
              </div>
            ))}
            {/* Repeat for seamless loop */}
            {(realStats.recentActivity.length > 0 ? realStats.recentActivity : [
              { label: 'Recently Hired', text: 'Full-stack Developer for Fintech SaaS', icon: Code2 },
              { label: 'New Project', text: 'AI Model Integration for Healthcare', icon: Zap },
              { label: 'Verified', text: 'Sr. DevOps Engineer joined from Google', icon: Shield },
              { label: 'Urgent SOS', text: 'React Native Expert needed for 48h sprint', icon: Star },
              { label: 'Community', text: '12 New Collaboration Rooms created', icon: Users },
            ]).map((item, idx) => (
              <div 
                key={idx + 100} 
                className="flex items-center gap-3 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm shadow-sm"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">{item.label || (item.type === 'JOB' ? 'New Job' : 'Activity')}</span>
                <span className="text-xs font-medium text-foreground/80">{item.text || item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── Live Opportunities Preview ─────────────────────────────────── */}
      {realStats.recentActivity.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Live Opportunities</h2>
              <p className="text-sm text-muted-foreground">Recently posted projects looking for experts.</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/jobs">
                View All Jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {realStats.recentActivity.slice(0, 3).map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border bg-card/50 hover:border-primary/30 hover:bg-card transition-all group"
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      {job.category}
                    </div>
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full text-xs h-8" asChild>
                    <Link href="/jobs">View Details</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Smart Trust & Performance Grid ─────────────────────────────── */}
      <section className="border-b bg-card/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container py-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                value: '1%', 
                label: 'Global Minimum Fee', 
                detail: '99% Revenue Retention',
                icon: Zap,
                border: 'border-blue-500/20'
              },
              { 
                value: realStats.totalFreelancers > 0 ? `${realStats.totalFreelancers}+` : '500+', 
                label: 'Verified Devs', 
                detail: 'GitHub/LinkedIn Vetted',
                icon: Shield,
                border: 'border-emerald-500/20'
              },
              { 
                value: '0', 
                label: 'Middleman Markup', 
                detail: 'Direct P2P Connection',
                icon: Users,
                border: 'border-violet-500/20'
              },
              { 
                value: realStats.openJobs > 0 ? `${realStats.openJobs}` : '24/7', 
                label: realStats.openJobs > 0 ? 'Live Jobs Open' : 'Smart Monitoring', 
                detail: 'AI Risk Assessment',
                icon: CheckCircle2,
                border: 'border-primary/20'
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${stat.border} bg-background/40 hover:bg-background/60 transition-colors group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tight text-foreground">{stat.value}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{stat.label}</p>
                  </div>
                  <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="h-full bg-primary/40"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">{stat.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Smart Bento Features ────────────────────────────────────────── */}
      <section className="container py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Zap className="h-3 w-3" />
            The Future of Work
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Built for the Next Generation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A decentralized approach to hiring. Direct, transparent, and powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-none md:grid-rows-2 gap-4 h-full md:h-[600px]">
          {/* Big Card 1: Direct Contact */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl border bg-card p-8 group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="h-40 w-40" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Direct Connection</h3>
                <p className="text-muted-foreground max-w-xs">
                  Skip the middlemen. Share GitHub, LinkedIn, or WhatsApp. We provide the platform, you own the relationship.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary">
                Learn how it works <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Matching */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-3 md:row-span-1 relative overflow-hidden rounded-3xl border bg-card p-8 group"
          >
            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-primary/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex gap-6 items-start">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Smart AI Matching</h3>
                <p className="text-muted-foreground text-sm">
                  Our engine analyzes technical depth and ranks the best-fit developers for every project in real-time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Commission */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl border bg-card p-8 group"
          >
            <div className="relative z-10 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold leading-tight">1% Fee Model</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Retain 99% of your hard-earned money. No more 20% platform cuts.
              </p>
            </div>
          </motion.div>

        </div>
      </section>
 
      {/* ── Smart Platform Walkthrough ───────────────────────────────────── */}
      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-muted/30 border-y">
        <div className="container py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left */}
            <div className="lg:sticky lg:top-28 space-y-4">
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold uppercase tracking-widest text-primary"
              >
                The Workflow
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight"
              >
                How Nainix <br />
                <span className="text-primary">Works.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-muted-foreground text-base leading-relaxed max-w-sm"
              >
                A four-step process optimized for speed, quality, and direct connections.
              </motion.p>
 
              {/* Two action links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-3 pt-4"
              >
                <Button asChild size="sm" className="gap-1.5">
                  <Link href="/register?role=client">
                    <BriefcaseBusiness className="h-4 w-4" />
                    Post a Project
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link href="/jobs">
                    <Code2 className="h-4 w-4" />
                    Browse Jobs
                  </Link>
                </Button>
              </motion.div>
            </div>
 
            {/* Right: Steps */}
            <div className="space-y-3 min-h-[460px] flex flex-col justify-start">
              <AnimatePresence initial={false} mode="wait">
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.45 }}
                    onClick={() => setActiveStep(idx)}
                    className={`rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                      activeStep === idx
                        ? 'bg-card border-primary/40 shadow-lg shadow-primary/5'
                        : 'bg-card/50 border-transparent hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-5 p-5">
                      <span
                        className={`text-2xl font-bold tabular-nums transition-colors duration-300 ${
                          activeStep === idx ? 'text-primary' : 'text-muted-foreground/30'
                        }`}
                      >
                        {step.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-base transition-colors duration-300 ${
                            activeStep === idx ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <AnimatePresence initial={false}>
                          {activeStep === idx && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                {step.desc}
                              </p>
                              <div className="h-0.5 bg-muted mt-4 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 4, ease: 'linear' }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          activeStep === idx
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="container py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple Commission Tiers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Upgrade anytime to lower your fee. No hidden charges, no lock-ins.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-2xl border p-5 sm:p-7 flex flex-col gap-4 transition-all duration-300 ${
                plan.highlight
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'bg-card hover:border-primary/30'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Best Value
                </span>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {plan.title}
                </p>
                <p className="text-4xl sm:text-5xl font-black text-foreground">{plan.fee}</p>
                <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
              </div>
              <Button
                size="sm"
                variant={plan.highlight ? 'default' : 'outline'}
                className="w-full mt-auto"
                asChild
              >
                <Link href={isAuthenticated ? '/pricing' : '/register'}>Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="border-t bg-card">
        <div className="container py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-2xl text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Ready to keep{' '}
              <span className="text-primary">more of your earnings?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Join developers and clients who've already ditched inflated platform fees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 font-semibold" asChild>
                <Link href={isAuthenticated ? '/dashboard' : '/register'}>
                  {isAuthenticated ? 'My Dashboard' : 'Get Started Free'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 font-semibold" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
