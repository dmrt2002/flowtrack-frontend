'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { SidebarNav } from './SidebarNav';
import { useEffect } from 'react';

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebarStore();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, closeMobile]);

  // Close mobile sidebar when resizing to desktop (md breakpoint)
  // But don't auto-close when resizing within mobile sizes
  useEffect(() => {
    const handleResize = () => {
      // Only close if we're at desktop size (>= 768px)
      if (window.innerWidth >= 768 && isMobileOpen) {
        closeMobile();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, closeMobile]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-sm md:hidden"
            onClick={closeMobile}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 bottom-0 left-0 z-50 flex w-[280px] flex-col border-r-[1.5px] border-neutral-200 bg-white md:hidden"
          >
            {/* Close button */}
            <div className="flex items-center justify-between border-b-[1.5px] border-neutral-200 px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-neutral-900">
                  FlowTrack
                </span>
              </div>
              <button
                onClick={closeMobile}
                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarNav collapsed={false} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
