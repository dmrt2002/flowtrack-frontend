'use client';

import {
  Menu,
  Search,
  Bell,
  Copy,
  ExternalLink,
  Check,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCurrentUser } from '@/store/currentUserStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  collapsed: boolean;
  publicFormUrl?: string;
}

export function TopBar({ collapsed, publicFormUrl }: TopBarProps) {
  const { openMobile } = useSidebarStore();
  const { currentUser } = useCurrentUser();
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getInitials = (
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(
    currentUser?.firstName,
    currentUser?.lastName,
    currentUser?.email
  );

  const handleCopyLink = async () => {
    if (!publicFormUrl) return;

    try {
      await navigator.clipboard.writeText(publicFormUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleVisitForm = () => {
    if (!publicFormUrl) return;
    window.open(publicFormUrl, '_blank');
  };

  // Format URL for display (remove protocol, truncate if needed)
  const displayUrl = publicFormUrl?.replace(/^https?:\/\//, '') || '';
  const truncatedUrl =
    displayUrl.length > 35 ? `${displayUrl.substring(0, 32)}...` : displayUrl;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <motion.header
      initial={false}
      animate={{
        paddingLeft: isMobile ? 0 : collapsed ? 80 : 296,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 right-0 left-0 z-30 h-16 border-b-[1.5px] border-neutral-200 bg-white md:left-auto md:pl-[296px]"
    >
      <div className="flex h-full items-center justify-between gap-4 px-6">
        {/* Mobile menu button */}
        <button
          onClick={openMobile}
          className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden max-w-md flex-1 sm:block">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-4 pl-10 text-[14px] transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Public Form Link - Compact Version */}
        {publicFormUrl && (
          <div className="hidden items-center gap-2 rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 px-3 py-1.5 lg:flex">
            <code className="font-mono text-[13px] font-medium text-indigo-900">
              {truncatedUrl}
            </code>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="rounded p-1.5 transition-colors hover:bg-indigo-100"
                title="Copy link"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-4 w-4 text-emerald-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-4 w-4 text-indigo-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVisitForm}
                className="rounded p-1.5 transition-colors hover:bg-indigo-100"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4 text-indigo-600" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
          </button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500">
                  <span className="text-[13px] font-semibold text-white">
                    {initials}
                  </span>
                </div>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-[13px] font-medium text-neutral-900">
                    {currentUser?.firstName || currentUser?.email || 'User'}
                  </span>
                  <span className="text-[12px] text-neutral-500">
                    {currentUser?.email}
                  </span>
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl border-[1.5px] border-neutral-200 bg-white p-2 shadow-lg"
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-3 py-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-2 bg-neutral-200" />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
