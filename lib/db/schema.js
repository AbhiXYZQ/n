// Database Schema Definitions for Nainix Marketplace
// Mock data structure following Prisma-like schema

import { v4 as uuidv4 } from 'uuid';

// User Schema
export const UserRole = {
  CLIENT: 'CLIENT',
  FREELANCER: 'FREELANCER'
};

export const UserPlan = {
  FREE: 'FREE',
  AI_PRO: 'AI_PRO'
};

// Job Status
export const JobStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

// Job Categories
export const JobCategory = {
  WEB_DEV: 'Web Development',
  APP_DEV: 'App Development',
  AI_ML: 'AI/ML',
  BLOCKCHAIN: 'Blockchain',
  DEVOPS: 'DevOps',
  BACKEND: 'Backend Development',
  FRONTEND: 'Frontend Development'
};

// Mock Users
export const mockUsers = [
  {
    id: uuidv4(),
    role: UserRole.FREELANCER,
    name: 'Sarah Chen',
    username: 'sarahchen',
    email: 'sarah@example.com',
    bio: 'Full-stack developer specializing in React and Node.js. 5+ years experience building scalable web applications.',
    verifiedBadges: ['Top Rated', 'Fast Responder'],
    monetization: {
      plan: UserPlan.AI_PRO,
      verificationBadgeActive: true,
      aiProActive: true,
      aiProActivatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    socialLinks: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      whatsapp: '+1234567890'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    portfolio: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop'
      }
    ],
    videoIntro: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: uuidv4(),
    role: UserRole.FREELANCER,
    name: 'Alex Rodriguez',
    username: 'alexdev',
    email: 'alex@example.com',
    bio: 'AI/ML Engineer with expertise in Python, TensorFlow, and deep learning.',
    verifiedBadges: ['AI Expert'],
    monetization: {
      plan: UserPlan.FREE,
      verificationBadgeActive: false,
      aiProActive: false,
      aiProActivatedAt: null
    },
    socialLinks: {
      github: 'https://github.com/alexdev',
      linkedin: 'https://linkedin.com/in/alexdev'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
    portfolio: [],
    videoIntro: null
  },
  {
    id: uuidv4(),
    role: UserRole.CLIENT,
    name: 'Tech Startup Inc',
    username: 'techstartup',
    email: 'contact@techstartup.com',
    bio: 'Series A startup looking for talented developers',
    verifiedBadges: ['Verified Client'],
    monetization: {
      plan: UserPlan.FREE,
      verificationBadgeActive: true,
      aiProActive: false,
      aiProActivatedAt: null
    },
    socialLinks: {},
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop',
    skills: [],
    portfolio: [],
    videoIntro: null
  }
];

// Mock Jobs
export const mockJobs = [
  {
    id: uuidv4(),
    clientId: mockUsers[2].id,
    title: 'Build a Real-time Chat Application',
    description: 'Need an experienced developer to build a real-time chat app with WebSocket support, user authentication, and message history.',
    category: JobCategory.WEB_DEV,
    budgetMin: 2000,
    budgetMax: 5000,
    isUrgent: true,
    requiredSkills: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    isFeatured: true,
    featuredUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: JobStatus.OPEN,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    clientId: mockUsers[2].id,
    title: 'AI-Powered Content Recommendation Engine',
    description: 'Looking for an ML engineer to develop a content recommendation system using collaborative filtering and deep learning.',
    category: JobCategory.AI_ML,
    budgetMin: 5000,
    budgetMax: 10000,
    isUrgent: false,
    requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP'],
    isFeatured: false,
    featuredUntil: null,
    status: JobStatus.OPEN,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: uuidv4(),
    clientId: mockUsers[2].id,
    title: 'Mobile App Development - React Native',
    description: 'Need a mobile developer to build a cross-platform app for iOS and Android with social features.',
    category: JobCategory.APP_DEV,
    budgetMin: 3000,
    budgetMax: 7000,
    isUrgent: true,
    requiredSkills: ['React Native', 'Firebase', 'Redux', 'REST API'],
    isFeatured: true,
    featuredUntil: new Date(Date.now() + 24 * 3600000).toISOString(),
    status: JobStatus.OPEN,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Mock Proposals
export const mockProposals = [
  {
    id: uuidv4(),
    jobId: mockJobs[0].id,
    freelancerId: mockUsers[0].id,
    pitch: 'I have 5+ years of experience building real-time applications. I can deliver this in 2 weeks with clean, scalable code.',
    estimatedDays: 14,
    price: 4000,
    smartMatchScore: 95,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    jobId: mockJobs[1].id,
    freelancerId: mockUsers[1].id,
    pitch: 'AI/ML specialist here. Built similar recommendation systems for e-commerce. Can start immediately.',
    estimatedDays: 30,
    price: 8000,
    smartMatchScore: 92,
    createdAt: new Date().toISOString()
  }
];

// Mock Collab Rooms
export const mockCollabRooms = [
  {
    id: uuidv4(),
    creatorId: mockUsers[0].id,
    title: 'Looking for UI Designer - Split Revenue 50/50',
    requiredRole: 'Designer',
    description: 'Have a $5k project building a SaaS dashboard. Need a talented UI/UX designer to partner with.',
    createdAt: new Date().toISOString()
  }
];

// Mock Success Stories for Live Ticker
export const mockSuccessStories = [
  { text: '✨ Sarah just completed a $4k project for TechCorp - Client rated 5/5!' },
  { text: '🎉 Alex delivered an AI model 3 days early - Amazing work!' },
  { text: '🚀 Maria earned $8k this month on Nainix - 100% commission kept!' },
  { text: '💡 James found his perfect client in under 24 hours!' },
  { text: '⚡ Zero fees saved freelancers $50k+ this month!' }
];
