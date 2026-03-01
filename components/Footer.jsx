'use client';

import Link from 'next/link';
import { Sparkles, Github, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nainix
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Nainix helps clients hire developers and freelancers find projects with direct connection and 0% commission.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">0% Platform Fee</div>
              <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">Direct Client Contact</div>
              <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">Smart Match Workflow</div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/register">Start Free</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Start</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing & Upgrades
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard/client" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">For Freelancers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors">
                  Find Work
                </Link>
              </li>
              <li>
                <Link href="/collab" className="hover:text-primary transition-colors">
                  Collab
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Join as Freelancer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/freelancer" className="hover:text-primary transition-colors">
                  Freelancer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">For Clients</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link href="/dashboard/client" className="hover:text-primary transition-colors">
                  Client Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-lg border bg-card p-4 md:p-5">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h4 className="text-sm font-semibold">Grow Faster with Premium</h4>
              <p className="text-sm text-muted-foreground">
                Unlock Featured Jobs, Verification Badge, and AI Pro tools from one pricing page.
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                View Plans
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nainix. Built for developers, by developers.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/legal/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal/refund" className="hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="https://github.com/AbhiXYZQ" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            
            <a href="https://x.com/nainix_me" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-muted-foreground hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.04H5.078z" />
              </svg>
            </a>

            <a href="https://www.linkedin.com/company/nainix/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>

            <a href="https://instagram.com/nainix.me" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>

            <a href="https://youtube.com/@nainix-me" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;