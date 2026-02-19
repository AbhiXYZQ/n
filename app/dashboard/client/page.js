'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/lib/store/authStore';
import useJobStore from '@/lib/store/jobStore';
import { JobCategory, JobStatus, mockUsers } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const { jobs, proposals, addJob } = useJobStore();
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    isUrgent: false,
    requiredSkills: ''
  });

  const myJobs = jobs.filter(j => j.clientId === user?.id);
  const myJobIds = myJobs.map(j => j.id);
  const myProposals = proposals.filter(p => myJobIds.includes(p.jobId));

  const handlePostJob = (e) => {
    e.preventDefault();
    
    const newJob = {
      id: uuidv4(),
      clientId: user.id,
      title: jobForm.title,
      description: jobForm.description,
      category: jobForm.category,
      budgetMin: parseInt(jobForm.budgetMin),
      budgetMax: parseInt(jobForm.budgetMax),
      isUrgent: jobForm.isUrgent,
      requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()),
      status: JobStatus.OPEN,
      createdAt: new Date().toISOString()
    };

    addJob(newJob);
    toast.success('Job posted successfully!');
    setPostJobOpen(false);
    setJobForm({
      title: '',
      description: '',
      category: '',
      budgetMin: '',
      budgetMax: '',
      isUrgent: false,
      requiredSkills: ''
    });
  };

  const getProposalsForJob = (jobId) => {
    return myProposals
      .filter(p => p.jobId === jobId)
      .sort((a, b) => b.smartMatchScore - a.smartMatchScore);
  };

  const getFreelancer = (freelancerId) => {
    return mockUsers.find(u => u.id === freelancerId);
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your job postings and proposals</p>
          </div>
          <Dialog open={postJobOpen} onOpenChange={setPostJobOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>Review proposals and manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                <Button className="mt-4" onClick={() => setPostJobOpen(true)}>
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {myJobs.map((job) => {
                  const jobProposals = getProposalsForJob(job.id);
                  return (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="mt-1">{job.description}</CardDescription>
                          </div>
                          <Badge variant={job.isUrgent ? 'destructive' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                                  <div key={proposal.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <Avatar>
                                      <AvatarImage src={freelancer?.avatarUrl} />
                                      <AvatarFallback>{freelancer?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold">{freelancer?.name}</p>
                                        <Badge variant="outline" className="text-xs">
                                          Match: {proposal.smartMatchScore}%
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{proposal.pitch}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm">
                                        <span>${proposal.price.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>{proposal.estimatedDays} days</span>
                                      </div>
                                    </div>
                                    <Button size="sm">View Profile</Button>
                                  </div>
                                );
                              })}
                            </div>
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
