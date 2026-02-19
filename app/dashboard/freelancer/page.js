'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, DollarSign, ListTodo, GripVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuthStore from '@/lib/store/authStore';
import useJobStore from '@/lib/store/jobStore';
import { mockJobs } from '@/lib/db/schema';
import Link from 'next/link';

const FreelancerDashboard = () => {
  const { user } = useAuthStore();
  const { proposals } = useJobStore();
  const [kanbanTasks, setKanbanTasks] = useState({
    todo: [
      { id: '1', title: 'Setup project repository', project: 'Chat App' },
      { id: '2', title: 'Design database schema', project: 'Chat App' }
    ],
    inProgress: [
      { id: '3', title: 'Implement WebSocket', project: 'Chat App' },
      { id: '4', title: 'Build authentication', project: 'Chat App' }
    ],
    review: [
      { id: '5', title: 'Code review', project: 'Chat App' }
    ]
  });

  const myProposals = proposals.filter(p => p.freelancerId === user?.id);
  const totalEarnings = myProposals.reduce((sum, p) => sum + p.price, 0);

  const getJobForProposal = (jobId) => {
    return mockJobs.find(j => j.id === jobId);
  };

  const KanbanColumn = ({ title, tasks, status, icon: Icon }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Icon className="mr-2 h-5 w-5" />
          {title}
          <Badge variant="secondary" className="ml-auto">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-muted rounded-lg cursor-move group"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your proposals and manage projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProposals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="proposals">My Proposals</TabsTrigger>
            <TabsTrigger value="kanban">Project Tracker</TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Proposals</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {myProposals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">You haven't submitted any proposals yet.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProposals.map((proposal) => {
                      const job = getJobForProposal(proposal.jobId);
                      return (
                        <Card key={proposal.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{job?.title}</CardTitle>
                                <CardDescription className="mt-1">{proposal.pitch}</CardDescription>
                              </div>
                              <Badge variant="outline" className="ml-4">
                                Match: {proposal.smartMatchScore}%
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center">
                                <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>${proposal.price.toLocaleString()}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>{proposal.estimatedDays} days</span>
                              </div>
                              <span>•</span>
                              <span className="text-muted-foreground">
                                Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kanban Tab */}
          <TabsContent value="kanban" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Project Tracker</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Organize your tasks with this Kanban board
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn
                title="To Do"
                tasks={kanbanTasks.todo}
                status="todo"
                icon={ListTodo}
              />
              <KanbanColumn
                title="In Progress"
                tasks={kanbanTasks.inProgress}
                status="inProgress"
                icon={Clock}
              />
              <KanbanColumn
                title="Review"
                tasks={kanbanTasks.review}
                status="review"
                icon={CheckCircle2}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default FreelancerDashboard;
