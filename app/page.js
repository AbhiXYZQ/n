'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockSuccessStories } from '@/lib/db/schema';

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="container relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center space-y-8"
          >
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm bg-card">
              <Zap className="mr-2 h-4 w-4 text-primary" fill="currentColor" />
              <span>0% Commission Forever</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                0% Commission.
              </span>
              <br />
              <span>100% Direct Connection.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The revolutionary freelancing platform built exclusively for developers. 
              Keep every dollar you earn. Connect directly with clients.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/jobs">
                  Find Dev Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/register">Join as Freelancer</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Ticker / Shoutout Wall */}
      <section className="w-full border-y bg-card py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...mockSuccessStories, ...mockSuccessStories].map((story, idx) => (
            <span key={idx} className="mx-8 text-sm text-muted-foreground">
              {story.text}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Developers Choose Nainix
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. No middleman, no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">0% Commission</h3>
                <p className="text-muted-foreground">
                  Keep 100% of what you earn. No platform fees, no hidden charges. 
                  Your work, your money.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Direct Contact</h3>
                <p className="text-muted-foreground">
                  Connect directly with clients. Share your GitHub, LinkedIn, or WhatsApp. 
                  Build real relationships.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered job matching based on your skills. Get ranked proposals 
                  and urgent SOS tags for quick gigs.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Get Started in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Choose Client or Freelancer' },
              { step: '02', title: 'Create Profile', desc: 'Showcase your skills & portfolio' },
              { step: '03', title: 'Browse Jobs', desc: 'Find projects that match your expertise' },
              { step: '04', title: 'Connect & Build', desc: 'Work directly with clients, zero fees' }
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-3">
                <div className="text-5xl font-bold text-primary/20">{item.step}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to keep 100% of your earnings?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who've already ditched the 20% platform fees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
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
