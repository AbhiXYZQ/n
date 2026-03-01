'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';
import { toast } from 'sonner';

const DashboardLayout = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access dashboard');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <main className="mx-auto w-full max-w-7xl">{children}</main>;
};

export default DashboardLayout;
