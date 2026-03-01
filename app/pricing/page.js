'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ShieldCheck, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const plans = [
  {
    icon: Sparkles,
    name: 'Featured Jobs Boost',
    price: '$9',
    period: 'per boosted job',
    description: 'Push your job to top spots for faster applications.',
    features: ['Top placement in jobs feed', 'Boost duration options: 24h / 72h', 'Priority visibility badge'],
    cta: 'Start Posting Jobs',
    href: '/dashboard/client'
  },
  {
    icon: ShieldCheck,
    name: 'Verification Badge',
    price: '$12',
    period: 'per month',
    description: 'Build trust and improve conversion across profile and proposals.',
    features: ['Verified profile badge', 'Higher response confidence', 'Trust highlight in listings'],
    cta: 'Get Verified',
    href: '/dashboard/freelancer'
  },
  {
    icon: Bot,
    name: 'AI Pro Plan',
    price: '$19',
    period: 'per month',
    description: 'Use AI-powered tools to improve proposal quality and win-rate.',
    features: ['AI proposal enhancement', 'Premium smart matching insights', 'Priority AI improvements'],
    cta: 'Upgrade to AI Pro',
    href: '/dashboard/freelancer'
  }
];

const PricingPage = () => {
  return (
    <div className="container px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-10"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Monetization designed to help both clients and freelancers grow faster while keeping 0% platform commission.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.name} className="h-full">
                <CardHeader className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">{plan.period}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
