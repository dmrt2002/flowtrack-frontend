'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import type { WorkflowStatus } from '../types/dashboard';

interface WorkflowStatusBannerProps {
  workflow?: WorkflowStatus | null;
}

export function WorkflowStatusBanner({ workflow }: WorkflowStatusBannerProps) {
  const router = useRouter();

  if (!workflow) return null;

  if (workflow.isActive) {
    const activatedDate = workflow.activatedAt
      ? formatDistanceToNow(new Date(workflow.activatedAt), { addSuffix: true })
      : 'recently';

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 rounded-xl border-[1.5px] border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 shadow-[0_2px_8px_rgba(16,185,129,0.08)] sm:mb-10 sm:rounded-2xl sm:p-5 lg:mb-10 lg:p-5"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Pulsing Status Dot */}
          <div className="relative flex-shrink-0">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 sm:h-3 sm:w-3" />
            <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-75 sm:h-3 sm:w-3" />
          </div>

          {/* Status Text */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-emerald-900 sm:text-[16px] lg:text-[16px]">
              Strategy Active: {workflow.strategyName || 'Gatekeeper'}
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 sm:text-[13px] lg:text-[13px]">
              Monitoring leads {activatedDate}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Inactive workflow state
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 rounded-xl border-[1.5px] border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 shadow-[0_2px_8px_rgba(245,158,11,0.08)] sm:mb-10 sm:rounded-2xl sm:p-5 lg:mb-10 lg:p-5"
    >
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
          </div>

          {/* Status Text */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-900 sm:text-[16px] lg:text-[16px]">
              No active workflow
            </p>
            <p className="mt-0.5 text-xs text-amber-700 sm:text-[13px] lg:text-[13px]">
              Complete onboarding to start qualifying leads automatically
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => router.push('/onboarding/strategy')}
          className="w-full flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] sm:w-auto sm:text-base lg:w-auto lg:text-base"
        >
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
}
