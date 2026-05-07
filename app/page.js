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

  useEffect(() => {
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

      {/* ── Social proof ticker ─────────────────────────────────────────── */}
      <section className="w-full border-b bg-muted/30 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...mockSuccessStories, ...mockSuccessStories].map((story, idx) => (
            <span key={idx} className="mx-8 text-xs text-muted-foreground">
              {story.text}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="border-b bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '1%', label: 'Minimum commission' },
              { value: '500+', label: 'Registered developers' },
              { value: '100%', label: 'Direct connections' },
              { value: '₹0', label: 'Hidden fees' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="space-y-1"
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="container py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why Nainix</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for Developers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            A simple, fair workflow for both sides — post work, apply, and connect directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border bg-card p-6 sm:p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

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
