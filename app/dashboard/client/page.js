'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/lib/store/authStore';
import useJobStore from '@/lib/store/jobStore';
import { JobCategory, JobStatus, mockUsers } from '@/lib/db/schema';
import { toast } from 'sonner';
import Link from 'next/link'; // ✅ ADDED: Link import for routing
import { trackEvent } from '@/lib/analytics';

const ClientDashboard = () => {
  const { user, applyMonetizationFromServer } = useAuthStore();
  const { jobs, proposals, createJob, fetchJobs, fetchProposals, promoteJobToFeatured, cleanupExpiredFeaturedJobs } = useJobStore();
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    isUrgent: false,
    requiredSkills: '',
    isFeatured: false,
    featuredDays: '3'
  });

  const verificationActive = user?.monetization?.verificationBadgeActive;

  const myJobs = jobs.filter(j => j.clientId === user?.id);
  const myJobIds = myJobs.map(j => j.id);
  const myProposals = proposals.filter(p => myJobIds.includes(p.jobId));

  const handlePostJob = async (e) => {
    e.preventDefault();

    try {
      const newJob = await createJob({
      title: jobForm.title,
      description: jobForm.description,
      category: jobForm.category,
      budgetMin: parseInt(jobForm.budgetMin),
      budgetMax: parseInt(jobForm.budgetMax),
      isUrgent: jobForm.isUrgent,
      requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()),
      isFeatured: jobForm.isFeatured,
      featuredDays: parseInt(jobForm.featuredDays)
      });

      trackEvent('client_job_posted', {
        clientId: user?.id,
        featured: !!newJob.isFeatured,
        urgent: !!newJob.isUrgent,
        category: newJob.category,
      });
      toast.success('Job posted successfully!');
      setPostJobOpen(false);
      setJobForm({
        title: '',
        description: '',
        category: '',
        budgetMin: '',
        budgetMax: '',
        isUrgent: false,
        requiredSkills: '',
        isFeatured: false,
        featuredDays: '3'
      });
    } catch (error) {
      toast.error(error.message || 'Unable to post job right now.');
    }
  };

  const handleActivateVerification = async () => {
    try {
      const response = await fetch('/api/monetization/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          role: user?.role,
          feature: 'VERIFICATION_BADGE'
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || 'Unable to activate verification right now.');
        return;
      }

      applyMonetizationFromServer({
        monetization: result.monetization,
        verifiedBadges: result.verifiedBadges
      });

      trackEvent('verification_upgraded', {
        userId: user?.id,
        role: user?.role,
      });
      toast.success('Verification badge activated.');
    } catch (error) {
      toast.error('Unable to activate verification right now.');
    }
  };

  const handleFeatureBoost = async (jobId) => {
    try {
      const response = await fetch('/api/jobs/feature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          role: user?.role,
          jobId,
          featuredDays: 3,
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || 'Unable to boost job right now.');
        return;
      }

      promoteJobToFeatured(jobId, result.featuredDays || 3);
      trackEvent('job_featured_upgraded', {
        userId: user?.id,
        jobId,
        featuredDays: result.featuredDays || 3,
      });
      toast.success('Job boosted as featured for 72 hours.');
    } catch (error) {
      toast.error('Unable to boost job right now.');
    }
  };

  const getProposalsForJob = (jobId) => {
    return myProposals
      .filter(p => p.jobId === jobId)
      .sort((a, b) => b.smartMatchScore - a.smartMatchScore);
  };

  const getFreelancer = (freelancerId) => {
    return mockUsers.find(u => u.id === freelancerId);
  };

  useEffect(() => {
    cleanupExpiredFeaturedJobs();
    fetchJobs();
    fetchProposals();
  }, [cleanupExpiredFeaturedJobs, fetchJobs, fetchProposals]);

  return (
    <div className="container px-4 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 md:space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Client Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your job postings and proposals</p>
          </div>
          <Dialog open={postJobOpen} onOpenChange={setPostJobOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Fill in the details about your project
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g., Build a Real-time Chat Application"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Describe your project in detail..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={jobForm.category} onValueChange={(val) => setJobForm({ ...jobForm, category: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(JobCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={jobForm.requiredSkills}
                      onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Budget Min ($)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      value={jobForm.budgetMin}
                      onChange={(e) => setJobForm({ ...jobForm, budgetMin: e.target.value })}
                      placeholder="2000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Budget Max ($)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      value={jobForm.budgetMax}
                      onChange={(e) => setJobForm({ ...jobForm, budgetMax: e.target.value })}
                      placeholder="5000"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={jobForm.isUrgent}
                    onChange={(e) => setJobForm({ ...jobForm, isUrgent: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="urgent" className="cursor-pointer">
                    Mark as Urgent (24H SOS)
                  </Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={jobForm.isFeatured}
                      onChange={(e) => setJobForm({ ...jobForm, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      Boost as Featured Job ($9)
                    </Label>
                  </div>
                  {jobForm.isFeatured && (
                    <div className="space-y-2">
                      <Label htmlFor="featuredDays">Boost Duration</Label>
                      <Select value={jobForm.featuredDays} onValueChange={(val) => setJobForm({ ...jobForm, featuredDays: val })}>
                        <SelectTrigger id="featuredDays">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">24 Hours</SelectItem>
                          <SelectItem value="3">72 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setPostJobOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Post Job
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myJobs.filter(j => j.status === JobStatus.OPEN).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProposals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myJobs.filter(j => j.status === JobStatus.COMPLETED).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Featured Jobs</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myJobs.filter(j => j.isFeatured && (!j.featuredUntil || new Date(j.featuredUntil) > new Date())).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Growth Tools</CardTitle>
            <CardDescription>Use monetization features to increase visibility and trust.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Verification Badge: {verificationActive ? 'Active' : 'Inactive'}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {!verificationActive && (
                <Button variant="outline" onClick={handleActivateVerification}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Activate Verification
                </Button>
              )}
              <Button asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>Review proposals and manage your projects</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                <Button className="mt-4 w-full sm:w-auto" onClick={() => setPostJobOpen(true)}>
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {myJobs.map((job) => {
                  const jobProposals = getProposalsForJob(job.id);
                  return (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="mt-1">{job.description}</CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {job.isFeatured && (!job.featuredUntil || new Date(job.featuredUntil) > new Date()) && (
                              <Badge className="w-fit bg-primary text-primary-foreground">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant={job.isUrgent ? 'destructive' : 'secondary'} className="w-fit">
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <span>Budget: ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}</span>
                            <span>•</span>
                            <span>{jobProposals.length} Proposals</span>
                          </div>

                          {jobProposals.length > 0 && (
                            <div className="space-y-3 pt-4 border-t">
                              <h4 className="font-semibold">Top Proposals</h4>
                              {jobProposals.slice(0, 3).map((proposal) => {
                                const freelancer = getFreelancer(proposal.freelancerId);
                                return (
                                  <div key={proposal.id} className="flex flex-col gap-3 p-4 bg-muted rounded-lg sm:flex-row sm:items-center sm:gap-4">
                                    <Avatar>
                                      <AvatarImage src={freelancer?.avatarUrl} />
                                      <AvatarFallback>{freelancer?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold">{freelancer?.name}</p>
                                        <Badge variant="outline" className="text-xs">
                                          Match: {proposal.smartMatchScore}%
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{proposal.pitch}</p>
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm">
                                        <span>${proposal.price.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>{proposal.estimatedDays} days</span>
                                      </div>
                                    </div>
                                    {/* ✅ FIXED: Button now properly links to the freelancer's public profile */}
                                    <Button size="sm" asChild className="w-full sm:w-auto">
                                      <Link href={`/${freelancer?.username}`}>View Profile</Link>
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {(!job.isFeatured || (job.featuredUntil && new Date(job.featuredUntil) <= new Date())) && (
                            <Button variant="outline" size="sm" onClick={() => handleFeatureBoost(job.id)}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Boost to Featured
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClientDashboard;