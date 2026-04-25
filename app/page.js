'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Users, CheckCircle2, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockSuccessStories } from '@/lib/db/schema';
import useAuthStore from '@/lib/store/authStore';

import MagneticGrid from '@/components/MagneticGrid';
import { PlexusSection, FloatingShowcase, ImpactNumbers, NeuralEngine, InteractiveCharacter, UltraButton } from '@/components/VisualBreaks';

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useMotionValue({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preventImageAction = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    };
    document.addEventListener('contextmenu', preventImageAction);
    document.addEventListener('dragstart', preventImageAction);
    return () => {
      document.removeEventListener('contextmenu', preventImageAction);
      document.removeEventListener('dragstart', preventImageAction);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      mouse.set({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse, isMobile]);

  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-primary via-accent to-primary p-0.5 text-center group cursor-pointer relative overflow-hidden">
        <Link href="/founders" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-white px-3 py-2 relative z-10 w-full">
          <Zap className="h-3.5 w-3.5 animate-pulse flex-shrink-0" />
          <span className="leading-tight"><strong className="underline underline-offset-2">Founders Offer:</strong> 0% Commission for first 100 members.</span>
          <ArrowRight className="h-3 w-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        {!isMobile && <MagneticGrid />}

        {/* Mobile hero bg animation */}
        {isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        )}

        <div className="container relative z-10 py-16 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center space-y-6 md:space-y-8"
          >
            {/* Hero heading — mobile: static gradient text, desktop: interactive chars */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight select-none leading-[1.15] py-1">
              {isMobile ? (
                <>
                  <span className="block hero-text-gradient mb-1">Hire Developers</span>
                  <span className="block hero-text-gradient">Directly.</span>
                  <span className="block text-foreground mt-2 text-2xl sm:text-3xl">Or Find Dev Work Fast.</span>
                </>
              ) : (
                <>
                  <div className="flex flex-nowrap justify-center gap-x-[0.2em] mb-2 overflow-visible">
                    {"Hire Developers Directly.".split(" ").map((word, wordIdx, arr) => (
                      <span key={`word-hire-${wordIdx}`} className="inline-flex gap-x-[0.1em]">
                        {word.split("").map((c, i) => (
                          <InteractiveCharacter key={`hire-${wordIdx}-${i}`} char={c} mouse={mouse} className="hero-text-gradient" xRange={[0, 0]} yRange={[-10, 0]} fontWeightRange={[700, 700]} />
                        ))}
                        {wordIdx < arr.length - 1 && <InteractiveCharacter char=" " mouse={mouse} xRange={[0, 0]} yRange={[-10, 0]} fontWeightRange={[700, 700]} />}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-center gap-y-2">
                    {"Or Find Dev Work Fast.".split(" ").map((word, wordIdx, arr) => (
                      <span key={`word-find-${wordIdx}`} className="inline-flex gap-x-[0.1em]">
                        {word.split("").map((c, i) => (
                          <InteractiveCharacter key={`find-${wordIdx}-${i}`} char={c} mouse={mouse} xRange={[0, 0]} yRange={[-10, 0]} fontWeightRange={[700, 700]} />
                        ))}
                        {wordIdx < arr.length - 1 && <InteractiveCharacter char=" " mouse={mouse} xRange={[0, 0]} yRange={[-10, 0]} fontWeightRange={[700, 700]} />}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Nainix is a freelancing platform where clients post projects, freelancers send proposals, and both connect directly without commission cuts.
            </p>

            {/* Steps */}
            <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-left px-2">
              {[
                '1. Client posts a project',
                '2. Freelancers submit proposals',
                '3. You connect and start directly'
              ].map((item) => (
                <motion.div
                  key={item}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border bg-card px-4 py-3 text-sm text-foreground active:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 sm:pt-10 px-4">
              {isMobile ? (
                <>
                  <Link href="/freelancers" className="w-full max-w-xs flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                    <span>Hire Developers</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link href="/jobs" className="w-full max-w-xs flex items-center justify-center gap-2 h-14 px-8 rounded-2xl border-2 border-primary/30 text-foreground font-bold text-base backdrop-blur-sm bg-background/50 active:scale-95 transition-transform">
                    <span>Find Dev Work</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/register?role=client"}
                    className="text-primary font-semibold text-sm flex items-center gap-1 mt-1"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Post a Project"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <UltraButton primary asChild>
                    <Link href="/freelancers" className="flex items-center gap-2 group">
                      <span>Hire Developers Directly</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </UltraButton>
                  <UltraButton asChild>
                    <Link href="/jobs" className="flex items-center gap-2 group">
                      <span>Find Dev Work Fast</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </UltraButton>
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/register?role=client"}
                    className="text-foreground font-black uppercase tracking-widest text-xs hover:text-primary transition-all flex items-center gap-2 group border-b border-transparent hover:border-primary pb-1"
                  >
                    <span>{isAuthenticated ? "Go to Dashboard" : "Post a Project"}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="w-full border-y bg-card py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...mockSuccessStories, ...mockSuccessStories].map((story, idx) => (
            <span key={idx} className="mx-6 text-xs sm:text-sm text-muted-foreground">
              {story.text}
            </span>
          ))}
        </div>
      </section>

      <PlexusSection />

      {/* Feature Cards */}
      <section className="container py-16 sm:py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Why Developers Choose Nainix</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">A simple workflow for both sides: post work, apply to work, connect directly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {[
              { icon: Zap, title: 'Lower Commissions', desc: 'Keep more of what you earn. Choose plans that reduce platform fees from 10% down to just 1%.', color: 'from-blue-500/20 to-primary/20' },
              { icon: Users, title: 'Direct Contact', desc: 'Connect directly with clients. Share your GitHub, LinkedIn, or WhatsApp. No middlemen.', color: 'from-purple-500/20 to-accent/20' },
              { icon: Shield, title: 'Smart Matching', desc: 'AI-powered job matching based on your skills. Get ranked proposals and urgent SOS tags.', color: 'from-emerald-500/20 to-emerald-400/20' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={!isMobile ? { y: -10 } : {}}
                whileTap={isMobile ? { scale: 0.97 } : {}}
                className="h-full"
              >
                <Card className="premium-glass h-full relative overflow-hidden group border-white/5 hover:border-primary/40 transition-all duration-500">
                  <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${feature.color} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                      <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{feature.desc}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-700" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <FloatingShowcase />

      {/* How It Works */}
      <section id="how-it-works" className="container py-20 sm:py-32 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start max-w-6xl mx-auto">
          {/* Left header */}
          <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              The Workflow
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              How <br />
              <span className="text-primary">Nainix</span> <br />
              Works.
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-medium max-w-sm">
              A four-step engineering pipeline optimized for speed and quality.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { title: 'Identity Verification', desc: 'Secure profile setup with automated GitHub/LinkedIn validation to ensure only elite developers join.' },
              { title: 'Project Deployment', desc: 'Clients post high-ticket projects with custom technical requirements and milestone-based structures.' },
              { title: 'Neural Matchmaking', desc: 'Our AI engine analyzes hundreds of parameters to rank and match the top 3 experts for every single role.' },
              { title: 'Direct Scaling', desc: 'Connect directly with zero commission cuts. Work, build, and scale your engineering team with total freedom.' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                onClick={() => setActiveStep(idx)}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] cursor-pointer transition-all duration-500 border-2 ${
                  activeStep === idx
                    ? 'bg-zinc-900 border-primary/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                    : 'bg-zinc-950/50 border-white/[0.03] opacity-60 hover:opacity-100 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className={`text-2xl sm:text-4xl font-black italic transition-colors duration-500 ${activeStep === idx ? 'text-primary' : 'text-zinc-800'}`}>0{idx + 1}</span>
                    <h3 className={`text-base sm:text-2xl font-black uppercase tracking-tight italic transition-colors duration-500 ${activeStep === idx ? 'text-white' : 'text-zinc-500'}`}>{step.title}</h3>
                  </div>
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full border flex items-center justify-center transition-all duration-500 flex-shrink-0 ${activeStep === idx ? 'border-primary bg-primary text-white rotate-90' : 'border-white/10 text-zinc-600'}`}>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {activeStep === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-400 text-sm sm:text-lg leading-relaxed font-medium pr-4 sm:pr-12">{step.desc}</p>
                      <div className="mt-4 sm:mt-8 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4, ease: "linear" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ImpactNumbers />

      {/* Pricing */}
      <section id="pricing" className="container py-16 sm:py-24 scroll-mt-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">Simple Tiered Commission</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">Upgrade to keep more of your revenue. No hidden platform taxes.</p>
          </div>

          {/* Mobile: 2×2 grid. Desktop: 4-col */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { title: 'FREE', fee: '10%', desc: 'Basic direct hiring', accent: 'border-border' },
              { title: 'Featured', fee: '8%', desc: 'Visibility boost', accent: 'border-primary/30' },
              { title: 'Verified', fee: '4%', desc: 'Trusted status', accent: 'border-accent/30' },
              { title: 'AI Pro', fee: '1%', desc: 'Ultimate tools', accent: 'border-primary shadow-lg shadow-primary/20 scale-[1.02] bg-primary/5' }
            ].map((plan) => (
              <motion.div key={plan.title} whileTap={{ scale: 0.96 }}>
                <Card className={`relative flex flex-col justify-between ${plan.accent} transition-transform hover:scale-[1.02] h-full`}>
                  <CardContent className="p-4 sm:p-8 space-y-2 sm:space-y-4">
                    <h3 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs">{plan.title}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-5xl font-black">{plan.fee}</span>
                      <span className="text-muted-foreground font-medium text-xs sm:text-base">fee</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">{plan.desc}</p>
                    <Button variant={plan.title === 'AI Pro' ? 'default' : 'outline'} className="w-full mt-2 sm:mt-4 text-xs sm:text-sm h-8 sm:h-10" asChild>
                      <Link href={isAuthenticated ? "/pricing" : "/register"}>Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Revenue features */}
      <section className="container py-16 sm:py-24 bg-card/50 border-y">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-8 sm:space-y-10">
          <div className="text-center space-y-3 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Scale Faster with Premium Plans</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">Unlock powerful tools and lower commission rates simultaneously.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {[
              { title: 'Featured Jobs Boost', desc: '8% Commission. Boost your job visibility for 24-72 hours and get faster premium proposals.' },
              { title: 'Verification Badge', desc: '4% Commission. Increase trust with a verified profile badge for 2x better response rates.' },
              { title: 'AI Pro Plan', desc: '1% Commission. Use AI proposal enhancement and premium matching tools to win more work.' }
            ].map((item) => (
              <motion.div key={item.title} whileTap={{ scale: 0.97 }}>
                <Card className="border bg-background h-full">
                  <CardContent className="p-5 sm:p-6 space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <NeuralEngine />

      {/* CTA */}
      <section className="container py-16 sm:py-24">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
          <CardContent className="p-7 sm:p-12 text-center space-y-5 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready to keep 100% of your earnings?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">Join thousands of developers who've already ditched the 20% platform fees.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>{isAuthenticated ? "My Dashboard" : "Get Started Free"}</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
