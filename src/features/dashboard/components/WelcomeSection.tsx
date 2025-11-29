'use client';

import { motion } from 'framer-motion';
import type { WorkflowStatus } from '../types/dashboard';

interface WelcomeSectionProps {
  userName?: string;
  workflow?: WorkflowStatus | null;
}

export function WelcomeSection({ userName, workflow }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 rounded-xl border-[1.5px] border-neutral-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:mb-10 sm:rounded-2xl sm:p-6 lg:mb-10 lg:p-8"
    >
      <h1 className="mb-2 text-2xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-[28px] lg:text-[32px]">
        Welcome back{userName ? `, ${userName}` : ''}! 👋
      </h1>
      <div className="flex items-center gap-2">
        {workflow?.isActive ? (
          <>
            <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-emerald-500" />
            <p className="text-sm text-neutral-500 sm:text-[15px] lg:text-[15px]">
              Your lead qualification system is active
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-500 sm:text-[15px] lg:text-[15px]">
            Complete setup to activate your workflow
          </p>
        )}
      </div>
    </motion.div>
  );
}
