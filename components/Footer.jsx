'use client';

import Link from 'next/link';
import { Heart, Github, Twitter } from 'lucide-react';
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
              <Heart className="mr-2 h-4 w-4" fill="currentColor" />
              Tip Jar
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Nainix. Built for developers, by developers.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
