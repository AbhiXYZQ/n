'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  IndianRupee, 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Share2,
  Bookmark,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ProposalModal from '@/components/ProposalModal';
import useAuthStore from '@/lib/store/authStore';
import { trackEvent } from '@/lib/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 24) return `${diffInHours || 1}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
        } else {
          toast.error(data.message || 'Job not found');
          router.push('/jobs');
        }
      } catch (err) {
        toast.error('Failed to load job details');
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id, router]);

  const handleApply = () => {
    trackEvent('job_detail_apply_clicked', { jobId: id });

    if (!isAuthenticated) {
      toast.error('Please login to submit a proposal');
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    if (user?.role !== 'FREELANCER') {
      toast.error('Only freelancers can submit proposals');
      return;
    }
    setProposalModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl space-y-8">
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6">
      <div className="container max-w-5xl mx-auto space-y-6">
        
        {/* Navigation / Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground group">
          <Link href="/jobs" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="truncate max-w-[200px]">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                      {job.category}
                    </Badge>
                    {job.isUrgent && (
                      <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-none animate-pulse">
                        <Zap className="mr-1.5 h-3.5 w-3.5" fill="currentColor" />
                        Urgent SOS
                      </Badge>
                    )}
                    {job.isFeatured && (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-none">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" fill="currentColor" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-4 w-4" />
                      Posted {formatTimeAgo(job.createdAt)}
                    </span>
                    <Separator orientation="vertical" className="h-4 hidden sm:block" />
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Payment Verified
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Project Description
                  </h3>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                    {job.description}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-secondary/50 hover:bg-secondary/80 py-1.5 px-3 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help/Safety Note */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/60 flex gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-0.5">Nainix Safety First</p>
                <p>Never share your personal payment details outside the platform. We hold funds in escrow for your protection.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <Card className="sticky top-24 border-none shadow-md ring-1 ring-primary/10 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60" />
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Project Budget</p>
                    <div className="flex items-baseline gap-1 text-2xl font-bold text-foreground">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <span>{job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/40 rounded-lg">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase mb-1">Applied</p>
                      <p className="text-lg font-bold flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        {Math.floor(Math.random() * 15) + 5}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-lg">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase mb-1">Due Date</p>
                      <p className="text-sm font-bold flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        Flexible
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button 
                      className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 group"
                      onClick={handleApply}
                      variant={job.isUrgent ? "destructive" : "default"}
                    >
                      Apply Now
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Bookmark className="h-3.5 w-3.5" /> Save
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Client Info Block */}
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">About the Client</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/5">
                      {job.client?.avatarUrl || job.client?.avatar_url ? (
                        <AvatarImage src={job.client.avatarUrl || job.client.avatar_url} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-primary/5 text-primary">
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{job.client?.name || 'Verified Client'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-green-600" />
                        Verified Partner
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                    <p className="flex justify-between items-center">
                      <span>Joined Nainix</span>
                      <span className="font-medium text-foreground">April 2024</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span>Total Spend</span>
                      <span className="font-medium text-foreground">₹50k+</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related/Sidebar Note */}
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Apply with AI Pro
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Subscribing to AI Pro highlights your proposal and gives you a <b>Smart Match</b> score based on your profile!
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs font-semibold" asChild>
                  <Link href="/pricing">Learn more</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {job && (
        <ProposalModal
          open={proposalModalOpen}
          onOpenChange={setProposalModalOpen}
          job={job}
        />
      )}
    </div>
  );
}
