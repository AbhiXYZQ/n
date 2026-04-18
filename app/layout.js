import './globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import PremiumChatbot from '@/components/PremiumChatbot';
import Preloader from '@/components/Preloader';
import Script from 'next/script';
import StructuredData from '@/components/StructuredData';

export const metadata = {
  metadataBase: new URL('https://nainix.me'),
  title: {
    default: 'Nainix - Best Developer-First Freelance Marketplace in India',
    template: '%s | Nainix'
  },
  description: 'Nainix helps clients hire top Indian developers and freelancers find projects with as low as 1% commission. Direct connection, no hidden fees, and high-quality tech gigs.',
  keywords: ['Nainix', 'Freelance Marketplace India', 'Hire Indian Developers', 'Remote Jobs India', 'Commission Free Freelancing', 'Best Freelance Platform for Indians', 'Tech Gigs India', 'Software Development Projects India', 'Bangalore Developers', 'Mumbai Freelancers', 'IT Outsourcing India'],
  authors: [{ name: 'Nainix Team' }],
  creator: 'Nainix',
  publisher: 'Nainix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nainix - Developer-First Freelance Marketplace',
    description: 'Directly connect with top developers in India. Commissions as low as 1%.',
    url: 'https://nainix.me',
    siteName: 'Nainix',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nainix - Developer-First Freelance Marketplace',
    description: 'Hire developers directly with unbeatable commission rates.',
    creator: '@nainix',
  },
  icons: {
    icon: '/logo_light.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <StructuredData />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Preloader />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <PremiumChatbot />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
