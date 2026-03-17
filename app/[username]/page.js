'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  MessageCircle,
  Shield,
  Play,
  Sparkles,
  ArrowLeft,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ─────────────────────────────────────────────────────────────
// Profile Skeleton — exact layout mirrors the real profile
// ─────────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-8">
    {/* Header Card Skeleton */}
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar skeleton */}
          <Skeleton className="h-32 w-32 rounded-full shrink-0" />

          {/* Info skeleton */}
          <div className="flex-1 space-y-4">
            {/* Name + badges row */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-28" />
            </div>

            {/* Bio skeleton — 3 lines */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Social buttons skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Skills Card Skeleton */}
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="flex flex-wrap gap-2">
          {[80, 96, 72, 112, 88].map((w) => (
            <Skeleton key={w} className="h-7 rounded-full" style={{ width: `${w}px` }} />
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Portfolio Card Skeleton */}
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Skeleton className="h-6 w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Not Found State
// ─────────────────────────────────────────────────────────────
const NotFoundState = ({ username, onRetry }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-24 flex flex-col items-center justify-center text-center gap-6"
    >
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
        <UserX className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground max-w-sm">
          No user with the username{' '}
          <span className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded text-sm">
            @{username}
          </span>{' '}
          exists on Nainix.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button variant="ghost" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild>
          <a href="/jobs">Browse Jobs</a>
        </Button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Profile Page
// ─────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);   // ← KEY FIX
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!params.username) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setFetchError(false);
      setUser(null);

      try {
        const response = await fetch(`/api/users/${params.username}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          setUser(null);
        } else {
          setUser(result.user);
        }
      } catch (error) {
        setFetchError(true);
        setUser(null);
      } finally {
        setIsLoading(false);   // ← always runs, clears loading
      }
    };

    fetchProfile();
  }, [params.username, retryCount]);

  // ── 1. Loading state → show skeleton ──────────────────────
  if (isLoading) {
    return (
      <div className="container py-12">
        <ProfileSkeleton />
      </div>
    );
  }

  // ── 2. Network/fetch error ─────────────────────────────────
  if (fetchError) {
    return (
      <div className="container py-24 text-center space-y-4">
        <p className="text-muted-foreground">Something went wrong while loading this profile.</p>
        <Button variant="outline" onClick={() => setRetryCount((c) => c + 1)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // ── 3. User not found ─────────────────────────────────────
  if (!user) {
    return (
      <NotFoundState
        username={params.username}
        onRetry={() => setRetryCount((c) => c + 1)}
      />
    );
  }

  // ── 4. Client profile ────────────────────────────────────
  if (user.role === 'CLIENT') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container py-24 flex flex-col items-center justify-center text-center gap-6"
      >
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Shield className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Client Profile</h1>
          <p className="text-muted-foreground max-w-sm">
            This is a private client account. Client profiles are not publicly visible on Nainix.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </motion.div>
    );
  }

  // ── 5. Full freelancer profile ────────────────────────────
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <Avatar className="h-32 w-32 shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.verifiedBadges?.map((badge, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                    {user?.monetization?.verificationBadgeActive && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {user?.monetization?.aiProActive && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">@{user.username}</p>
                </div>

                <p className="text-base leading-relaxed">{user.bio}</p>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  {user.socialLinks?.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {user.socialLinks?.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {user.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${user.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                  {user.socialLinks?.whatsapp && (
                    <Button size="sm" asChild>
                      <a
                        href={`https://wa.me/${user.socialLinks.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Intro */}
        {user.videoIntro && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Video Introduction</h2>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={user.videoIntro}
                  title="Video Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Skills &amp; Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio */}
        {user.portfolio && user.portfolio.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.portfolio.map((project, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
