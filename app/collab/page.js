'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, CheckCircle2, HandshakeIcon, MessageSquare, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockCollabRooms, mockUsers } from '@/lib/db/schema';
import useAuthStore from '@/lib/store/authStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────────────────────
// Express Interest Modal — fully self-contained component
// ─────────────────────────────────────────────────────────────
const InterestModal = ({ collab, creator, open, onOpenChange, onSuccess }) => {
  const { user } = useAuthStore();
  const [interestForm, setInterestForm] = useState({
    message: '',
    skills: '',
    contactEmail: user?.email || '',
    contactWhatsApp: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!interestForm.message.trim() || interestForm.message.trim().length < 20) {
      toast.error('Please write at least 20 characters in your message.');
      return;
    }

    if (!interestForm.skills.trim()) {
      toast.error('Please mention your relevant skills.');
      return;
    }

    if (!interestForm.contactEmail.trim() && !interestForm.contactWhatsApp.trim()) {
      toast.error('Please provide at least one contact method (email or WhatsApp).');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/collab/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collabId: collab.id,
          collabTitle: collab.title,
          creatorId: collab.creatorId,
          ...interestForm
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Interest sent to ${creator?.name}! They'll reach out soon.`, {
          description: result.message,
          duration: 5000,
        });
        
        onOpenChange(false);
        onSuccess(collab.id);

        // Reset form
        setInterestForm({
          message: '',
          skills: '',
          contactEmail: user?.email || '',
          contactWhatsApp: '',
        });
      } else {
        toast.error(result.message || 'Failed to send interest.');
      }
    } catch (err) {
      console.error('[InterestModal]', err);
      toast.error('Unable to send interest right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = interestForm.message.length;
  const charLimit = 500;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandshakeIcon className="h-5 w-5 text-primary" />
            Express Your Interest
          </DialogTitle>
          <DialogDescription>
            Send a message to <strong>{creator?.name}</strong> for the collab&nbsp;
            <strong>"{collab?.title}"</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Creator Info Banner */}
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator?.avatarUrl} />
            <AvatarFallback>{creator?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{creator?.name}</p>
            <p className="text-xs text-muted-foreground">Looking for: <Badge variant="secondary" className="text-xs ml-1">{collab?.requiredRole}</Badge></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="interest-message">
              Your Message
              <span className="text-muted-foreground text-xs ml-2">({charCount}/{charLimit})</span>
            </Label>
            <Textarea
              id="interest-message"
              placeholder={`Hi ${creator?.name}, I'm interested in collaborating! I can help with the ${collab?.requiredRole} role because...`}
              rows={4}
              maxLength={charLimit}
              value={interestForm.message}
              onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
              required
              className={charCount >= charLimit ? 'border-destructive' : ''}
            />
            {charCount < 20 && charCount > 0 && (
              <p className="text-xs text-destructive">
                At least 20 characters required ({20 - charCount} more needed)
              </p>
            )}
          </div>

          {/* Relevant Skills */}
          <div className="space-y-2">
            <Label htmlFor="interest-skills">Your Relevant Skills</Label>
            <Input
              id="interest-skills"
              placeholder="e.g., Figma, React, After Effects"
              value={interestForm.skills}
              onChange={(e) => setInterestForm({ ...interestForm, skills: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mention skills relevant to the role they need
            </p>
          </div>

          <Separator />

          {/* Contact Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              How can they contact you? (at least one required)
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="interest-email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="interest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={interestForm.contactEmail}
                  onChange={(e) => setInterestForm({ ...interestForm, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="interest-whatsapp" className="text-xs text-muted-foreground">
                  WhatsApp Number
                </Label>
                <Input
                  id="interest-whatsapp"
                  placeholder="+91 9876543210"
                  value={interestForm.contactWhatsApp}
                  onChange={(e) => setInterestForm({ ...interestForm, contactWhatsApp: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Interest
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────────────
// Single Collab Card — handles all button states
// ─────────────────────────────────────────────────────────────
const CollabCard = ({ collab, creator, user, isAuthenticated, onExpressInterest, alreadySent }) => {
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const router = useRouter();
  const isOwnCollab = user?.id === collab.creatorId;

  const handleExpressInterestClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to express interest', {
        description: 'Create a free account or login to connect with collaborators.',
        action: {
          label: 'Login',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    if (isOwnCollab) {
      toast.info("This is your own collab post — you can't express interest in it.");
      return;
    }

    setInterestModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`hover:shadow-lg transition-all duration-200 ${alreadySent ? 'border-primary/30' : ''}`}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={creator?.avatarUrl} />
                <AvatarFallback>{creator?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <CardTitle className="text-xl">{collab.title}</CardTitle>
                  <Badge variant="secondary">{collab.requiredRole}</Badge>
                  {isOwnCollab && (
                    <Badge variant="outline" className="text-xs">Your Post</Badge>
                  )}
                </div>
                <CardDescription>
                  Posted by{' '}
                  <Link
                    href={`/${creator?.username}`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {creator?.name}
                  </Link>{' '}
                  • {new Date(collab.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-base mb-5 leading-relaxed">{collab.description}</p>

            {/* Interest Sent State Banner */}
            <AnimatePresence>
              {alreadySent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 flex items-center gap-2 text-sm text-primary"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Your interest has been sent! {creator?.name} will contact you soon.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-3">
              {/* Express Interest Button */}
              {alreadySent ? (
                <Button variant="secondary" disabled className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Interest Sent
                </Button>
              ) : (
                <Button
                  onClick={handleExpressInterestClick}
                  className="gap-2"
                  disabled={isOwnCollab}
                >
                  <HandshakeIcon className="h-4 w-4" />
                  {isOwnCollab ? 'Your Post' : 'Express Interest'}
                </Button>
              )}

              {/* View Profile Button */}
              {creator?.username && (
                <Button variant="outline" asChild>
                  <Link href={`/${creator.username}`}>View Profile</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Express Interest Modal */}
      <InterestModal
        collab={collab}
        creator={creator}
        open={interestModalOpen}
        onOpenChange={setInterestModalOpen}
        onSuccess={onExpressInterest}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Collab Page
// ─────────────────────────────────────────────────────────────
const CollabPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [collabRooms, setCollabRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  // Track which collab IDs the current user has expressed interest in
  const [expressedInterestIds, setExpressedInterestIds] = useState(new Set());
  const [formData, setFormData] = useState({
    title: '',
    requiredRole: '',
    description: '',
  });

  const getCreator = (collab) => {
    // If the API joined the creator, return it
    if (collab.creator) return collab.creator;
    // Otherwise fallback to mock users (for initial or mock data)
    return mockUsers.find((u) => u.id === collab.creatorId);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/collab');
        const data = await response.json();
        if (data.success) {
          setCollabRooms(data.collabRooms);
        }
      } catch (err) {
        console.error('Failed to fetch collabs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateCollab = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to create a collab post');
      return;
    }

    try {
      const response = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCollabRooms([data.collab, ...collabRooms]);
        toast.success('Collab post created! Others can now express interest.');
        setCreateDialogOpen(false);
        setFormData({ title: '', requiredRole: '', description: '' });
      } else {
        toast.error(data.message || 'Failed to create collab post.');
      }
    } catch (err) {
      console.error('Create collab error:', err);
      toast.error('Unable to create collab post right now.');
    }
  };

  // Called when interest is successfully submitted from InterestModal
  const handleInterestSuccess = (collabId) => {
    setExpressedInterestIds((prev) => new Set([...prev, collabId]));
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community Collab</h1>
            <p className="text-muted-foreground mt-1">
              Partner with other freelancers to tackle bigger projects
            </p>
          </div>

          {/* Create Collab Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
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
                  <Label htmlFor="collab-title">Title</Label>
                  <Input
                    id="collab-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Looking for UI Designer - Split Revenue 50/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collab-role">Required Role</Label>
                  <Input
                    id="collab-role"
                    value={formData.requiredRole}
                    onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
                    placeholder="e.g., Designer, Backend Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collab-description">Description</Label>
                  <Textarea
                    id="collab-description"
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
                  <Button type="submit">Create Post</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
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
              Team up with other freelancers to take on larger projects. Split the work, share the
              revenue, and build something amazing together.
            </CardContent>
          </Card>
        </div>

        {/* Collab Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Collabs</h2>
            {expressedInterestIds.size > 0 && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {expressedInterestIds.size} interest{expressedInterestIds.size > 1 ? 's' : ''} sent
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse text-lg">Loading collab rooms...</p>
            </div>
          ) : collabRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <HandshakeIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No collab posts yet. Be the first to create one!</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Collab
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {collabRooms.map((collab) => (
                <CollabCard
                  key={collab.id}
                  collab={collab}
                  creator={getCreator(collab)}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  alreadySent={expressedInterestIds.has(collab.id)}
                  onExpressInterest={handleInterestSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CollabPage;