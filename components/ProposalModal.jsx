'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useJobStore from '@/lib/store/jobStore';
import useAuthStore from '@/lib/store/authStore';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

const ProposalModal = ({ open, onOpenChange, job }) => {
  const [pitch, setPitch] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { createProposal } = useJobStore();
  const { user } = useAuthStore();
  const aiProActive = user?.monetization?.aiProActive;

  const handleEnhancePitch = () => {
    const basePitch = pitch.trim();
    if (!basePitch) {
      toast.error('Please write your pitch first.');
      return;
    }

    const enhanced = `Hi, I reviewed your project and I can deliver this with a clear execution plan. ${basePitch} I will provide regular updates, milestone-based delivery, and production-ready quality.`;
    setPitch(enhanced.slice(0, 300));
    trackEvent('proposal_pitch_enhanced', {
      jobId: job?.id,
      userId: user?.id,
      aiProActive: !!aiProActive,
    });
    toast.success('Pitch enhanced with AI Pro.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProposal({
        jobId: job.id,
        pitch,
        estimatedDays: parseInt(estimatedDays),
        price: parseInt(price),
      });

      trackEvent('proposal_submitted', {
        jobId: job.id,
        freelancerId: user.id,
        aiProActive: !!aiProActive,
      });
      toast.success('Proposal submitted successfully!');
      setPitch('');
      setEstimatedDays('');
      setPrice('');
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Unable to submit proposal right now.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Proposal</DialogTitle>
          <DialogDescription>
            {job.title}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pitch">Your Pitch (max 300 characters)</Label>
            <Textarea
              id="pitch"
              placeholder="Why you're the perfect fit for this project..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value.slice(0, 300))}
              maxLength={300}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {pitch.length}/300
            </p>
            {aiProActive ? (
              <Button type="button" size="sm" variant="secondary" onClick={handleEnhancePitch}>
                Enhance with AI Pro
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                AI pitch enhancement is available in AI Pro.{' '}
                <Link href="/pricing" className="text-primary hover:underline">Upgrade now</Link>
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Estimated Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="14"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Your Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="4000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalModal;
