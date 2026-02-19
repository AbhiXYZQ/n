'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import JobCard from '@/components/JobCard';
import ProposalModal from '@/components/ProposalModal';
import useJobStore from '@/lib/store/jobStore';
import useAuthStore from '@/lib/store/authStore';
import { JobCategory } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const JobsPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const { filters, setFilters, getFilteredJobs } = useJobStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    setFilteredJobs(getFilteredJobs());
  }, [filters]);

  const handleApply = (job) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a proposal');
      router.push('/login');
      return;
    }
    if (user?.role !== 'FREELANCER') {
      toast.error('Only freelancers can submit proposals');
      return;
    }
    setSelectedJob(job);
    setProposalModalOpen(true);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={filters.category || 'all'} onValueChange={(val) => setFilters({ category: val === 'all' ? null : val })}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(JobCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="urgent">Urgent SOS Only</Label>
          <Switch
            id="urgent"
            checked={filters.urgentOnly}
            onCheckedChange={(checked) => setFilters({ urgentOnly: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Popular Skills</Label>
        <div className="flex flex-wrap gap-2">
          {['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'MongoDB'].map((skill) => (
            <Badge
              key={skill}
              variant={filters.skills.includes(skill) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const newSkills = filters.skills.includes(skill)
                  ? filters.skills.filter(s => s !== skill)
                  : [...filters.skills, skill];
                setFilters({ skills: newSkills });
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({ category: null, budgetMin: 0, budgetMax: 100000, skills: [], urgentOnly: false })}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterSidebar />
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Find Your Next Gig</h1>
              <p className="text-muted-foreground mt-1">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
              </p>
            </div>
            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.urgentOnly || filters.skills.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary">
                  {filters.category}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ category: null })}
                  />
                </Badge>
              )}
              {filters.urgentOnly && (
                <Badge variant="secondary">
                  Urgent Only
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ urgentOnly: false })}
                  />
                </Badge>
              )}
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ skills: filters.skills.filter(s => s !== skill) })}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Jobs Grid */}
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs
                .sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0))
                .map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No jobs found matching your filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilters({ category: null, budgetMin: 0, budgetMax: 100000, skills: [], urgentOnly: false })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      <ProposalModal
        open={proposalModalOpen}
        onOpenChange={setProposalModalOpen}
        job={selectedJob}
      />
    </div>
  );
};

export default JobsPage;
