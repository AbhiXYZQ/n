'use client';

import Link from 'next/link';
import { Heart, Github, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nainix
            </h3>
            <p className="text-sm text-muted-foreground">
              0% Commission. 100% Direct Connection.
            </p>
          </div>

          {/* For Freelancers */}
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
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
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
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support the Platform</h4>
            <p className="text-sm text-muted-foreground">
              Love Nainix? Help us keep it 0% commission forever!
            </p>
            <Button variant="outline" className="w-full">
              <Heart className="mr-2 h-4 w-4 text-red-500" fill="currentColor" />
              Tip Jar
            </Button>
          </div>
        </div>

        {/* Bottom Bar with Legal Pages */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright & Legal Links */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nainix. Built for developers, by developers.
            </p>
            {/* 🚀 NEW: Legal Pages Links */}
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
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a href="https://github.com/AbhiXYZQ" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            
            <a href="https://x.com/nainix_me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.04H5.078z" />
              </svg>
            </a>

            <a href="https://www.linkedin.com/company/nainix/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>

            <a href="https://instagram.com/nainix.me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>

            <a href="https://youtube.com/@nainix-me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;