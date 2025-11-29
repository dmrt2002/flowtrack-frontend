'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/store/currentUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`relative px-1 py-2 text-[15px] font-medium transition-colors ${
        active ? 'text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'
      }`}
    >
      {children}
      {active && (
        <div className="absolute right-0 bottom-0 left-0 h-[3px] rounded-t-full bg-indigo-600" />
      )}
    </button>
  );
}

export function GlobalNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, clearUser } = useCurrentUser();

  const handleLogout = () => {
    clearUser();
    // Clear auth cookies
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie =
      'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  // Get user initials
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-[72px] border-b-[1.5px] border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-8">
        {/* Logo */}
        <button
          onClick={() => router.push('/dashboard-home')}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2L3 6V14L10 18L17 14V6L10 2Z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="text-[18px] font-bold tracking-tight text-neutral-900">
            FlowTrack
          </span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <NavLink
            href="/dashboard-home"
            active={pathname === '/dashboard-home'}
          >
            Dashboard
          </NavLink>
          <NavLink href="/leads" active={pathname?.startsWith('/leads')}>
            Leads
          </NavLink>
          <NavLink
            href="/analytics"
            active={pathname?.startsWith('/analytics')}
          >
            Analytics
          </NavLink>
          <NavLink href="/settings" active={pathname?.startsWith('/settings')}>
            Settings
          </NavLink>
        </div>

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105">
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {currentUser?.name || 'User'}
                </span>
                <span className="text-xs font-normal text-neutral-500">
                  {currentUser?.email || ''}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
