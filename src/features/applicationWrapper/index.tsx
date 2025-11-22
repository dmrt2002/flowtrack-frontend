'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { TanStackQueryProvider } from '@/lib/tanstack/query-client';
import { GetCurrentUser } from './GetCurrentUser';

export function ApplicationWrappers({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryProvider>
      <GetCurrentUser />
      {children}
      <Toaster />
    </TanStackQueryProvider>
  );
}
