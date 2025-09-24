'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import DashboardLayout from './DashboardLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Pages that should use the dashboard layout
  const dashboardPages = ['/dashboard', '/history', '/settings'];
  const shouldUseDashboardLayout = isAuthenticated && dashboardPages.some(page => pathname.startsWith(page));

  if (shouldUseDashboardLayout) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Default layout with navbar for public pages
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default LayoutWrapper;
