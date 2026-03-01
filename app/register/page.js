'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react'; // ✅ ADDED: Linkedin icon
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import useAuthStore from '@/lib/store/authStore';

const RegisterPage = () => {
  const [role, setRole] = useState('FREELANCER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    country: '',
    timezone: '',
    bio: '',
    linkedin: '',
    github: '',
    professionalTitle: '',
    experienceYears: '',
    hourlyRate: '',
    skills: '',
    availability: '',
    portfolioUrl: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    hiringGoal: '',
    budgetRange: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSocialRegister = (provider) => {
    toast.info(`${provider} registration will be connected soon!`);
    // Yahan hum aage chalkar Clerk/NextAuth ka signup logic lagayenge
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      timezone: formData.timezone.trim(),
      bio: formData.bio.trim(),
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      professionalTitle: formData.professionalTitle.trim(),
      experienceYears: formData.experienceYears,
      hourlyRate: formData.hourlyRate,
      skills: formData.skills.trim(),
      availability: formData.availability,
      portfolioUrl: formData.portfolioUrl.trim(),
      companyName: formData.companyName.trim(),
      companyWebsite: formData.companyWebsite.trim(),
      companySize: formData.companySize,
      hiringGoal: formData.hiringGoal.trim(),
      budgetRange: formData.budgetRange,
      acceptTerms: formData.acceptTerms,
    };

    if (!trimmedData.name || !trimmedData.email || !trimmedData.username || !trimmedData.password || !trimmedData.phone || !trimmedData.country || !trimmedData.timezone) {
      toast.error('Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (trimmedData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (trimmedData.bio.length < 30) {
      toast.error('Bio should be at least 30 characters.');
      setLoading(false);
      return;
    }

    if (!trimmedData.acceptTerms) {
      toast.error('Please accept terms and privacy policy.');
      setLoading(false);
      return;
    }

    if (role === 'FREELANCER') {
      const skillsCount = trimmedData.skills.split(',').map((skill) => skill.trim()).filter(Boolean).length;
      if (!trimmedData.professionalTitle || !trimmedData.experienceYears || !trimmedData.hourlyRate || !trimmedData.availability || skillsCount < 3) {
        toast.error('Freelancer profile requires title, experience, rate, availability, and at least 3 skills.');
        setLoading(false);
        return;
      }

      if (!trimmedData.github && !trimmedData.linkedin) {
        toast.error('Add at least GitHub or LinkedIn profile link.');
        setLoading(false);
        return;
      }
    }

    if (role === 'CLIENT') {
      if (!trimmedData.companyName || !trimmedData.companySize || !trimmedData.hiringGoal || !trimmedData.budgetRange) {
        toast.error('Client profile requires company details, hiring goal, and budget range.');
        setLoading(false);
        return;
      }
    }

    try {
      const roleDetails = role === 'FREELANCER'
        ? {
            professionalTitle: trimmedData.professionalTitle,
            experienceYears: Number(trimmedData.experienceYears || 0),
            hourlyRate: Number(trimmedData.hourlyRate || 0),
            skills: trimmedData.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
            availability: trimmedData.availability,
            portfolioUrl: trimmedData.portfolioUrl,
          }
        : {
            companyName: trimmedData.companyName,
            companyWebsite: trimmedData.companyWebsite,
            companySize: trimmedData.companySize,
            hiringGoal: trimmedData.hiringGoal,
            budgetRange: trimmedData.budgetRange,
          };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          name: trimmedData.name,
          email: trimmedData.email,
          username: trimmedData.username,
          password: trimmedData.password,
          phone: trimmedData.phone,
          country: trimmedData.country,
          timezone: trimmedData.timezone,
          bio: trimmedData.bio,
          linkedin: trimmedData.linkedin,
          github: trimmedData.github,
          acceptTerms: trimmedData.acceptTerms,
          roleDetails,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || 'Unable to create account.');
        setLoading(false);
        return;
      }

      login(result.user);
      toast.success('Account created successfully!');
      router.push(result.user.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer');
    } catch (error) {
      toast.error('Unable to create account right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Join Nainix and start with 0% commission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={setRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="FREELANCER">I'm a Freelancer</TabsTrigger>
                <TabsTrigger value="CLIENT">I'm a Client</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 🚀 UPDATED: 4 Social Registration Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button type="button" variant="outline" onClick={() => handleSocialRegister('Google')} className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline" onClick={() => handleSocialRegister('Apple')} className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/>
                </svg>
                Apple
              </Button>
              <Button type="button" variant="outline" onClick={() => handleSocialRegister('GitHub')} className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button type="button" variant="outline" onClick={() => handleSocialRegister('LinkedIn')} className="w-full">
                <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
                LinkedIn
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your profile will be at nainix.me/{formData.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    placeholder="Asia/Kolkata"
                    value={formData.timezone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    name="github"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell clients/freelancers what you do and your strengths..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              {role === 'FREELANCER' ? (
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Freelancer Details</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="professionalTitle">Professional Title</Label>
                      <Input
                        id="professionalTitle"
                        name="professionalTitle"
                        placeholder="Full Stack Developer"
                        value={formData.professionalTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Experience (Years)</Label>
                      <Input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        min="0"
                        placeholder="3"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="1"
                        placeholder="30"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select value={formData.availability} onValueChange={(val) => setFormData({ ...formData, availability: val })}>
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LESS_THAN_10">Less than 10 hrs/week</SelectItem>
                          <SelectItem value="PART_TIME">Part-time (10-20 hrs/week)</SelectItem>
                          <SelectItem value="FULL_TIME">Full-time (30+ hrs/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Core Skills (comma-separated, min 3)</Label>
                    <Input
                      id="skills"
                      name="skills"
                      placeholder="React, Node.js, MongoDB, TypeScript"
                      value={formData.skills}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio URL (optional)</Label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Client Company Details</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Acme Labs Pvt Ltd"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website (optional)</Label>
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        placeholder="https://acme.com"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select value={formData.companySize} onValueChange={(val) => setFormData({ ...formData, companySize: val })}>
                        <SelectTrigger id="companySize">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1_10">1-10</SelectItem>
                          <SelectItem value="11_50">11-50</SelectItem>
                          <SelectItem value="51_200">51-200</SelectItem>
                          <SelectItem value="201_1000">201-1000</SelectItem>
                          <SelectItem value="1000_PLUS">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Typical Project Budget</Label>
                      <Select value={formData.budgetRange} onValueChange={(val) => setFormData({ ...formData, budgetRange: val })}>
                        <SelectTrigger id="budgetRange">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNDER_1000">Under $1k</SelectItem>
                          <SelectItem value="1000_5000">$1k - $5k</SelectItem>
                          <SelectItem value="5000_20000">$5k - $20k</SelectItem>
                          <SelectItem value="20000_PLUS">$20k+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hiringGoal">Hiring Goal</Label>
                    <Textarea
                      id="hiringGoal"
                      name="hiringGoal"
                      placeholder="What kind of developers or projects are you hiring for?"
                      value={formData.hiringGoal}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2 rounded-lg border p-3">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm font-normal leading-5">
                  I agree to the Terms of Service and Privacy Policy, and confirm my details are correct.
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;