# Nainix Marketplace - Developer-First Freelancing

A revolutionary freelancing platform built exclusively for developers and tech professionals. Unbeatable commission models (10% down to 1%), direct connections, and smart AI matching.

## 🚀 Features

### Core Features
- **Tiered Commission (10% - 1%)** - Upgrade your plan to keep more of your revenue
- **Legacy 0% for Founders** - First 100 developers get lifetime 0% commission
- **Direct Contact** - Connect directly with clients via GitHub, LinkedIn, Email, WhatsApp
- **Smart AI Matching** - Proposals ranked by AI-powered match scores
- **24H SOS Tags** - Urgent jobs with glowing badges for quick turnaround
- **Community Collab** - Partner with other freelancers on larger projects
- **Dynamic Profiles** - Beautiful portfolio pages with video introductions
- **Featured Jobs Boost** - Clients can boost jobs for higher visibility and 8% commission
- **Verification Badge** - Trust badge with 4% commission tier
- **AI Pro Plan** - Premium tools with our lowest 1% commission tier

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Database:** MongoDB (with mock data for demo)
- **Icons:** Lucide React
- **Theme:** Dark Mode Default (Slate/Zinc with Neon Electric Blue/Purple)

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js    # API routes
│   ├── page.js                      # Landing page with Pricing Table
│   ├── layout.js                    # Root layout with theme provider
│   ├── founders/page.js             # Manifesto and Elite 100 Reward
│   ├── pricing/page.js              # Tiered Plan Details
│   ├── login/page.js                # Login page
│   ├── register/page.js             # Registration with role selection
│   ├── jobs/page.js                 # Job discovery with filters
│   ├── collab/page.js               # Community collaboration
│   ├── [username]/page.js           # Dynamic profile pages
│   └── dashboard/
│       ├── layout.js                # Protected route wrapper
│       ├── client/page.js           # Client dashboard
│       └── freelancer/page.js       # Freelancer dashboard with Kanban
├── components/
│   ├── Navbar.jsx                   # Global navigation with Cmd+K search
│   ├── Footer.jsx                   # Footer with social links
│   ├── JobCard.jsx                  # Job listing card
│   └── ProposalModal.jsx            # Proposal submission modal
├── lib/
│   ├── db/schema.js                 # Mock database schema
│   ├── store/
│   │   ├── authStore.js            # Authentication state
│   │   └── jobStore.js             # Jobs and proposals state
│   └── utils.js                     # Utility functions
└── globals.css                      # Global styles and theme

```

## 🎨 Design System

### Colors
- **Background:** Slate/Zinc dark (hsl(222, 47%, 4%))
- **Primary:** Electric Blue (hsl(217, 91%, 60%))
- **Accent:** Neon Purple (hsl(262, 83%, 58%))
- **Muted:** Dark slate (hsl(217, 33%, 17%))

### Typography
- System fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- Bold headlines with gradient text effects
- Clean, minimalist design

### Animations
- Framer Motion for page transitions
- Scrolling Wireframe Globe on Founders page
- Glowing urgent job badges
- Scrolling marquee for success stories

## 💳 Commission Model

Nainix is moving away from a strictly 0% model to a sustainable tiered structure:

- **FREE:** 10% Commission
- **Featured Boost:** 8% Commission
- **Verification Badge:** 4% Commission
- **AI Pro Plan:** 1% Commission
- **Founding members (First 100):** Legacy 0% Commission

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=your_key
```

4. Start local development
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎯 Future Enhancements

1. **Escrow Integration** - Optional secure payments
2. **Real Authentication** - Integrate Clerk or NextAuth
3. **Real-time Chat** - WebSocket for direct messaging
4. **Email Notifications** - Resend integration for job alerts

## 📄 License

MIT License - Built for developers, by developers.

---

**Built with ❤️ for the developer community**

*Lowest Commissions. 100% Direct Connection.*
