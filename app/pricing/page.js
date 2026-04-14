'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ShieldCheck, Bot, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';
import useAuthStore from '@/lib/store/authStore';

const plans = [
  {
    icon: User,
    name: 'Free Tier',
    price: '₹0',
    numericPrice: 0,
    period: 'Standard',
    description: 'Perfect for getting started with direct hiring.',
    features: ['10% platform commission', 'Unlimited job searches', 'Basic profile listing'],
    cta: 'Start Now',
    href: '/register',
    accent: false,
    featureKey: 'FREE'
  },
  {
    icon: Sparkles,
    name: 'Featured Jobs Boost',
    price: '₹799',
    numericPrice: 799,
    period: 'per boosted job',
    description: 'Push your job to top spots and lower your commission.',
    features: ['8% platform commission', 'Top placement in jobs feed', 'Priority visibility badge'],
    cta: 'Boost Job',
    href: '/dashboard/client',
    accent: false,
    featureKey: 'FEATURED_JOB'
  },
  {
    icon: ShieldCheck,
    name: 'Verification Badge',
    price: '₹999',
    numericPrice: 999,
    period: 'per month',
    description: 'Build trust with a verified status and keep more earnings.',
    features: ['4% platform commission', 'Higher response confidence', 'Trust highlight in listings'],
    cta: 'Get Verified',
    href: '/dashboard/freelancer',
    accent: false,
    featureKey: 'VERIFICATION_BADGE'
  },
  {
    icon: Bot,
    name: 'AI Pro Plan',
    price: '₹1599',
    numericPrice: 1599,
    period: 'per month',
    description: 'The ultimate toolset for professionals with the lowest fees.',
    features: ['1% platform commission', 'AI proposal enhancement', 'Premium smart matching insights'],
    cta: 'Upgrade to AI Pro',
    href: '/dashboard/freelancer',
    accent: true,
    featureKey: 'AI_PRO'
  }
];

const PricingPage = () => {
  const { processPayment } = useRazorpay();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handlePlanAction = (plan) => {
    if (plan.numericPrice === 0) {
      router.push(plan.href);
      return;
    }

    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }

    processPayment({
      amount: plan.numericPrice,
      feature: plan.featureKey,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });
  };

  return (
    <div className="container px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-10"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold md:text-5xl tracking-tight">Simple, Growth-Focused Pricing</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Keep more of what you earn as you grow. Our tiered commission model is designed to sustain the community while rewarding active professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isOwned = 
              (plan.featureKey === 'AI_PRO' && user?.monetization?.plan === 'AI_PRO') ||
              (plan.featureKey === 'VERIFICATION_BADGE' && user?.monetization?.verificationBadgeActive);

            return (
              <Card key={plan.name} className={`h-full border-2 ${plan.accent ? 'border-primary shadow-lg shadow-primary/10' : 'hover:border-primary/50 transition-colors'}`}>
                <CardHeader className="space-y-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${plan.accent ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 min-h-[40px]">{plan.description}</CardDescription>
                  </div>
                  <div>
                    <p className="text-4xl font-black">{plan.price}</p>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{plan.period}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${feature.includes('%') ? 'text-primary font-bold' : 'text-muted-foreground/60'}`} />
                        <span className={feature.includes('%') ? 'font-bold text-foreground' : 'text-muted-foreground'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handlePlanAction(plan)}
                    disabled={isOwned}
                    className="w-full" 
                    variant={plan.accent ? 'default' : (isOwned ? 'secondary' : 'outline')}
                  >
                    {isOwned ? 'Active' : plan.cta}
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
