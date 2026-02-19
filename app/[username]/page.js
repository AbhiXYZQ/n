'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MessageCircle, Shield, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockUsers } from '@/lib/db/schema';

const ProfilePage = () => {
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Find user by username
    const foundUser = mockUsers.find(u => u.username === params.username);
    setUser(foundUser);
  }, [params.username]);

  if (!user) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground mt-2">The profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (user.role === 'CLIENT') {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">Client Profile</h1>
        <p className="text-muted-foreground mt-2">Client profiles are private.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.verifiedBadges?.map((badge, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground">@{user.username}</p>
                </div>

                <p className="text-base">{user.bio}</p>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  {user.socialLinks?.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {user.socialLinks?.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {user.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${user.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                  {user.socialLinks?.whatsapp && (
                    <Button size="sm" asChild>
                      <a href={`https://wa.me/${user.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Intro */}
        {user.videoIntro && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Video Introduction</h2>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={user.videoIntro}
                  title="Video Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio */}
        {user.portfolio && user.portfolio.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.portfolio.map((project, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
