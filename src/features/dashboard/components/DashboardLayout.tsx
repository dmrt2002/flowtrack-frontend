'use client';

import { motion } from 'framer-motion';
import { useSidebarStore } from '@/store/sidebarStore';
import { Sidebar, MobileSidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  publicFormUrl?: string; // Deprecated: TopBar now fetches this internally
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Top Bar */}
      <TopBar collapsed={isCollapsed} />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          paddingLeft: isMobile ? 0 : isCollapsed ? 64 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="pt-16 md:pl-[280px]"
      >
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
