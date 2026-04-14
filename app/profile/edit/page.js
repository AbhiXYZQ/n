'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  ArrowLeft,
  Save,
  Loader2,
  Github,
  Linkedin,
  MessageCircle,
  Link2,
  Image as ImageIcon,
  Briefcase,
  MapPin,
  Sparkles,
  Video,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import useAuthStore from '@/lib/store/authStore';
import Link from 'next/link';

const SKILL_OPTIONS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB',
  'PostgreSQL', 'Python', 'Django', 'AI/ML', 'DevOps', 'AWS',
  'UI/UX', 'Vue.js', 'Angular', 'GraphQL', 'Docker', 'Kubernetes',
  'Figma', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Rust',
];

// ─── Section wrapper ─────────────────────────────────────────
const Section = ({ icon: Icon, title, description, children }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        {title}
      </CardTitle>
      {description && <CardDescription className="text-xs">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

// ─── Edit Profile Page ────────────────────────────────────────
const EditProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form state — initialised from store
  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
    city: '',
    state: '',
    country: '',
    professionalTitle: '',
    hourlyRate: '',
    experienceYears: '',
    availability: '',
    portfolioUrl: '',
    videoIntro: '',
    skills: [],
    socialLinks: { github: '', linkedin: '', whatsapp: '' },
    portfolio: [],
  });

  // Prefill from auth store
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        professionalTitle: user.professionalTitle || '',
        hourlyRate: user.hourlyRate ? String(user.hourlyRate) : '',
        experienceYears: user.experienceYears ? String(user.experienceYears) : '',
        availability: user.availability || '',
        portfolioUrl: user.portfolioUrl || '',
        videoIntro: user.videoIntro || '',
        skills: user.skills || [],
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          whatsapp: user.socialLinks?.whatsapp || '',
        },
        portfolio: user.portfolio || [],
      });
    }
  }, [user, isAuthenticated, router]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const setSocial = (key, value) =>
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));

  const toggleSkill = (skill) => {
    set(
      'skills',
      form.skills.includes(skill)
        ? form.skills.filter((s) => s !== skill)
        : [...form.skills, skill]
    );
  };

  // Portfolio item helpers
  const addPortfolioItem = () => {
    set('portfolio', [...form.portfolio, { title: '', description: '', image: '' }]);
  };
  const removePortfolioItem = (idx) => {
    set('portfolio', form.portfolio.filter((_, i) => i !== idx));
  };
  const updatePortfolioItem = (idx, key, value) => {
    set(
      'portfolio',
      form.portfolio.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    if (form.bio.trim().length < 20) { toast.error('Bio must be at least 20 characters.'); return; }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        professionalTitle: form.professionalTitle.trim(),
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        availability: form.availability || undefined,
        portfolioUrl: form.portfolioUrl.trim(),
        videoIntro: form.videoIntro.trim(),
        skills: form.skills,
        socialLinks: {
          github: form.socialLinks.github.trim(),
          linkedin: form.socialLinks.linkedin.trim(),
          whatsapp: form.socialLinks.whatsapp.trim(),
        },
        portfolio: form.portfolio.filter((p) => p.title.trim()),
      };

      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to save profile.');
        return;
      }

      // Update Zustand store so UI reflects instantly
      updateUser(result.user);
      toast.success('Profile updated successfully!', {
        description: 'Your changes are live on your profile.',
      });
      router.push(`/${user.username}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  const isFreelancer = user.role === 'FREELANCER';

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-sm text-muted-foreground">Update your public profile information</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2 shrink-0">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>

        {/* ── Avatar preview ─────────────────────────────── */}
        <Section icon={ImageIcon} title="Profile Photo" description="Paste an image URL to update your avatar">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={form.avatarUrl || undefined} alt={form.name} />
              <AvatarFallback className="text-2xl">{form.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="avatarUrl">Avatar Image URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://example.com/photo.jpg"
                value={form.avatarUrl}
                onChange={(e) => set('avatarUrl', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use a direct image URL (jpg, png, webp). Unsplash links work great.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Basic Info ─────────────────────────────────── */}
        <Section icon={User} title="Basic Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name <span className="text-destructive">*</span></Label>
              <Input id="edit-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={`@${user.username}`} disabled className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bio">
              Professional Summary <span className="text-destructive">*</span>
              <span className="ml-2 text-xs text-muted-foreground">({form.bio.length} chars, min 20)</span>
            </Label>
            <Textarea
              id="edit-bio"
              rows={4}
              placeholder="Tell clients what you do and what makes you great…"
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              maxLength={800}
            />
          </div>
        </Section>

        {/* ── Location ──────────────────────────────────── */}
        <Section icon={MapPin} title="Location">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input id="edit-city" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Lucknow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">State</Label>
              <Input id="edit-state" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Uttar Pradesh" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input id="edit-country" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="India" />
            </div>
          </div>
        </Section>

        {/* ── Freelancer Details (only for freelancers) ── */}
        {isFreelancer && (
          <>
            <Section icon={Briefcase} title="Freelancer Details" description="Shown on your public profile and used for smart-match">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Professional Title</Label>
                  <Input id="edit-title" value={form.professionalTitle} onChange={(e) => set('professionalTitle', e.target.value)} placeholder="Full Stack Developer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rate">Hourly Rate (₹/hr)</Label>
                  <Input id="edit-rate" type="number" min="1" value={form.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} placeholder="30" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-exp">Experience (years)</Label>
                  <Input id="edit-exp" type="number" min="0" value={form.experienceYears} onChange={(e) => set('experienceYears', e.target.value)} placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select value={form.availability} onValueChange={(v) => set('availability', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LESS_THAN_10">Less than 10 hrs/week</SelectItem>
                      <SelectItem value="PART_TIME">Part-time (10–20 hrs/week)</SelectItem>
                      <SelectItem value="FULL_TIME">Full-time (30+ hrs/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Section>

            {/* ── Skills ──────────────────────────────────── */}
            <Section icon={Sparkles} title="Skills & Expertise" description="Select the skills you excel at">
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={form.skills.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-primary/80 select-none"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {form.skills.length} skill{form.skills.length !== 1 ? 's' : ''}
              </p>
            </Section>
          </>
        )}

        {/* ── Social Links ──────────────────────────────── */}
        <Section icon={Link2} title="Social Links" description="Help clients find and contact you directly">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder="https://github.com/yourusername"
                value={form.socialLinks.github}
                onChange={(e) => setSocial('github', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.socialLinks.linkedin}
                onChange={(e) => setSocial('linkedin', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder="+91 9876543210"
                value={form.socialLinks.whatsapp}
                onChange={(e) => setSocial('whatsapp', e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* ── Portfolio URL & Video ─────────────────────── */}
        {isFreelancer && (
          <Section icon={Video} title="Portfolio & Video Introduction">
            <div className="space-y-2">
              <Label htmlFor="edit-portfolio-url">Portfolio Website URL</Label>
              <Input
                id="edit-portfolio-url"
                placeholder="https://yourportfolio.com"
                value={form.portfolioUrl}
                onChange={(e) => set('portfolioUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-video">YouTube Embed URL</Label>
              <Input
                id="edit-video"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                value={form.videoIntro}
                onChange={(e) => set('videoIntro', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use the embed URL format: youtube.com/embed/VIDEO_ID
              </p>
            </div>
          </Section>
        )}

        {/* ── Portfolio Projects ─────────────────────────── */}
        {isFreelancer && (
          <Section icon={ImageIcon} title="Portfolio Projects" description="Showcase your best work">
            <div className="space-y-4">
              {form.portfolio.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Project {idx + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removePortfolioItem(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input
                      placeholder="E-commerce Dashboard"
                      value={project.title}
                      onChange={(e) => updatePortfolioItem(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      placeholder="What did you build and what problem did it solve?"
                      value={project.description}
                      onChange={(e) => updatePortfolioItem(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Image URL</Label>
                    <Input
                      placeholder="https://example.com/screenshot.jpg"
                      value={project.image}
                      onChange={(e) => updatePortfolioItem(idx, 'image', e.target.value)}
                    />
                  </div>
                </motion.div>
              ))}
              {form.portfolio.length < 6 && (
                <Button type="button" variant="outline" className="w-full gap-2" onClick={addPortfolioItem}>
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              )}
            </div>
          </Section>
        )}

        {/* ── Save Button (bottom) ─────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-32">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;
