'use client';

import { useState } from 'react';
import {
  Edit,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { LeadDetailResponse } from '../types/lead';
import { useUpdateLeadStatus, useEnrichLead } from '../hooks/use-leads';

interface LeadDetailSidebarProps {
  lead: LeadDetailResponse;
  workspaceId: string;
  compact?: boolean;
  enrichmentOnly?: boolean;
}

export function LeadDetailSidebar({
  lead,
  workspaceId,
  enrichmentOnly = false,
}: LeadDetailSidebarProps) {
  const updateStatusMutation = useUpdateLeadStatus();
  const enrichLeadMutation = useEnrichLead();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);

  const handleMarkAsWon = async () => {
    setIsUpdating(true);
    try {
      await updateStatusMutation.mutateAsync({
        workspaceId,
        leadId: lead.id,
        dto: { status: 'WON' },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsLost = async () => {
    setIsUpdating(true);
    try {
      await updateStatusMutation.mutateAsync({
        workspaceId,
        leadId: lead.id,
        dto: { status: 'LOST' },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEnrichLead = async () => {
    setIsEnriching(true);
    try {
      await enrichLeadMutation.mutateAsync({
        workspaceId,
        leadId: lead.id,
      });
      toast.success('Enrichment queued! Data will be updated shortly.');
    } catch {
      toast.error('Failed to queue enrichment. Please try again.');
    } finally {
      setIsEnriching(false);
    }
  };

  // Calculate enrichment completion
  const enrichmentStatus = lead.enrichmentData
    ? {
        company: !!lead.enrichmentData.company,
        person: !!lead.enrichmentData.person,
        email: !!lead.enrichmentData.email,
        techStack: !!(
          lead.enrichmentData.company?.techStack &&
          lead.enrichmentData.company.techStack.length > 0
        ),
      }
    : null;

  const totalEnriched = enrichmentStatus
    ? Object.values(enrichmentStatus).filter(Boolean).length
    : 0;
  const totalSections = 4;
  const enrichmentPercentage = (totalEnriched / totalSections) * 100;

  // If enrichmentOnly is true, only render the enrichment status card
  if (enrichmentOnly) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        {enrichmentStatus ? (
          <div>
            <h3 className="mb-2 text-xs font-semibold text-neutral-900">
              Enrichment Status
            </h3>
            {lead.enrichedAt ? (
              <div className="mb-2 flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>
                  {formatDistanceToNow(new Date(lead.enrichedAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="ml-auto font-bold text-neutral-900">
                  {Math.round(enrichmentPercentage)}%
                </span>
              </div>
            ) : (
              <p className="mb-2 text-xs text-neutral-500">
                Enrichment pending
              </p>
            )}
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${enrichmentPercentage}%` }}
              />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              <div
                className={`flex items-center gap-1.5 ${enrichmentStatus.company ? 'text-green-600' : 'text-neutral-400'}`}
              >
                {enrichmentStatus.company ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <span className="flex h-3.5 w-3.5 items-center justify-center">
                    –
                  </span>
                )}
                <span>Company</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${enrichmentStatus.email ? 'text-green-600' : 'text-neutral-400'}`}
              >
                {enrichmentStatus.email ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <span className="flex h-3.5 w-3.5 items-center justify-center">
                    –
                  </span>
                )}
                <span>Email</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${enrichmentStatus.person ? 'text-green-600' : 'text-neutral-400'}`}
              >
                {enrichmentStatus.person ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <span className="flex h-3.5 w-3.5 items-center justify-center">
                    –
                  </span>
                )}
                <span>Person</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${enrichmentStatus.techStack ? 'text-green-600' : 'text-neutral-400'}`}
              >
                {enrichmentStatus.techStack ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <span className="flex h-3.5 w-3.5 items-center justify-center">
                    –
                  </span>
                )}
                <span>
                  Tech Stack{' '}
                  {enrichmentStatus.techStack &&
                    `(${lead.enrichmentData?.company?.techStack?.length})`}
                </span>
              </div>
            </div>
            <button
              onClick={handleEnrichLead}
              disabled={isEnriching}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-xs font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Enriching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {lead.enrichedAt ? 'Re-enrich Lead' : 'Enrich Lead'}
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Sparkles className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              No Enrichment Data
            </h3>
            <p className="mb-4 text-xs text-neutral-600">
              Enrich this lead to get company info, tech stack, and more.
            </p>
            <button
              onClick={handleEnrichLead}
              disabled={isEnriching}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enriching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Enrich Lead</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      <div>
        <h3 className="mb-1.5 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-1.5 lg:flex-col">
          <button
            className="hover:border-brand-primary flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-50 lg:flex-none lg:justify-start"
            onClick={() => {}}
          >
            <Edit className="h-3 w-3" />
            <span className="hidden lg:inline">Edit</span>
          </button>
          <button
            className="hover:border-brand-primary flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-50 lg:flex-none lg:justify-start"
            onClick={() => {}}
          >
            <Mail className="h-3 w-3" />
            <span className="hidden lg:inline">Email</span>
          </button>
          <button
            className="hover:border-brand-primary flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-50 lg:flex-none lg:justify-start"
            onClick={() => {}}
          >
            <Calendar className="h-3 w-3" />
            <span className="hidden lg:inline">Meet</span>
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs transition-colors hover:border-green-500 hover:bg-green-50 disabled:opacity-50 lg:flex-none lg:justify-start"
            onClick={handleMarkAsWon}
            disabled={isUpdating || lead.status === 'WON'}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )}
            <span className="hidden lg:inline">
              {lead.status === 'WON' ? 'Won' : 'Won'}
            </span>
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs transition-colors hover:border-red-500 hover:bg-red-50 disabled:opacity-50 lg:flex-none lg:justify-start"
            onClick={handleMarkAsLost}
            disabled={isUpdating || lead.status === 'LOST'}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            <span className="hidden lg:inline">
              {lead.status === 'LOST' ? 'Lost' : 'Lost'}
            </span>
          </button>
        </div>
      </div>

      {/* Enrichment Status - Ultra Compact */}
      {enrichmentStatus && (
        <div>
          <h3 className="mb-1.5 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
            Enrichment
          </h3>
          {lead.enrichedAt ? (
            <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(lead.enrichedAt), {
                  addSuffix: true,
                })}
              </span>
              <span className="ml-auto font-bold text-neutral-900">
                {Math.round(enrichmentPercentage)}%
              </span>
            </div>
          ) : (
            <p className="mb-1 text-[10px] text-neutral-500">Pending</p>
          )}
          <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${enrichmentPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span
              className={
                enrichmentStatus.company ? 'text-green-600' : 'text-neutral-400'
              }
            >
              {enrichmentStatus.company ? '✓' : '–'} Co
            </span>
            <span
              className={
                enrichmentStatus.email ? 'text-green-600' : 'text-neutral-400'
              }
            >
              {enrichmentStatus.email ? '✓' : '–'} Em
            </span>
            <span
              className={
                enrichmentStatus.person ? 'text-green-600' : 'text-neutral-400'
              }
            >
              {enrichmentStatus.person ? '✓' : '–'} Per
            </span>
            <span
              className={
                enrichmentStatus.techStack
                  ? 'text-green-600'
                  : 'text-neutral-400'
              }
            >
              {enrichmentStatus.techStack
                ? `✓ ${lead.enrichmentData?.company?.techStack?.length}`
                : '–'}{' '}
              Tech
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
