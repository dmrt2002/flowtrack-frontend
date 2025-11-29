'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LeadCard } from './LeadCard';
import { EmptyLeadsState } from './EmptyLeadsState';
import type { LeadSummary } from '../types/dashboard';

interface LeadsSectionProps {
  leads: LeadSummary[];
  publicFormUrl?: string;
  isLoading?: boolean;
}

export function LeadsSection({
  leads,
  publicFormUrl,
  isLoading,
}: LeadsSectionProps) {
  const router = useRouter();

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:rounded-2xl sm:p-6 lg:p-8"
    >
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl lg:text-xl">
          Recent Leads
        </h2>
        {leads.length > 0 && (
          <button
            onClick={() => router.push('/leads')}
            className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline sm:text-sm lg:text-sm"
          >
            <span className="hidden sm:inline">View All →</span>
            <span className="sm:hidden">View All</span>
          </button>
        )}
      </div>

      {/* Lead List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      ) : leads.length === 0 ? (
        <EmptyLeadsState publicFormUrl={publicFormUrl} />
      ) : (
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={handleLeadClick} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
