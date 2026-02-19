'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCollabRooms, mockUsers } from '@/lib/db/schema';
import useAuthStore from '@/lib/store/authStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const CollabPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [collabRooms, setCollabRooms] = useState(mockCollabRooms);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    requiredRole: '',
    description: ''
  });

  const handleCreateCollab = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to create a collab post');
      return;
    }

    const newCollab = {
      id: uuidv4(),
      creatorId: user.id,
      ...formData,
      createdAt: new Date().toISOString()
    };

    setCollabRooms([newCollab, ...collabRooms]);
    toast.success('Collab post created!');
    setCreateDialogOpen(false);
    setFormData({ title: '', requiredRole: '', description: '' });
  };

  const getCreator = (creatorId) => {
    return mockUsers.find(u => u.id === creatorId);
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
            <h1 className="text-3xl font-bold">Community Collab</h1>
            <p className="text-muted-foreground mt-1">
              Partner with other freelancers to tackle bigger projects
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Collab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Collab Post</DialogTitle>
                <DialogDescription>
                  Find partners for your next big project
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCollab} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Looking for UI Designer - Split Revenue 50/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Required Role</Label>
                  <Input
                    id="role"
                    value={formData.requiredRole}
                    onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
                    placeholder="e.g., Designer, Backend Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the project and collaboration terms..."
                    rows={4}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Post
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Collabs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collabRooms.length}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Why Collab?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Team up with other freelancers to take on larger projects. Split the work, share the revenue, and build something amazing together.
            </CardContent>
          </Card>
        </div>

        {/* Collab Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Collabs</h2>
          {collabRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No collab posts yet. Be the first to create one!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {collabRooms.map((collab) => {
                const creator = getCreator(collab.creatorId);
                return (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={creator?.avatarUrl} />
                            <AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{collab.title}</CardTitle>
                              <Badge variant="secondary">{collab.requiredRole}</Badge>
                            </div>
                            <CardDescription>
                              Posted by {creator?.name} • {new Date(collab.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base mb-4">{collab.description}</p>
                        <div className="flex items-center gap-3">
                          <Button>
                            Express Interest
                          </Button>
                          <Button variant="outline" asChild>
                            <a href={`/${creator?.username}`}>View Profile</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CollabPage;
