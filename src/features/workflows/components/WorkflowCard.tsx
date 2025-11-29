'use client';

import React from 'react';
import { Eye, Code2, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { WorkflowListItem } from '../types/workflow';

interface WorkflowCardProps {
  workflow: WorkflowListItem;
  onGetEmbedCode: (workflowId: string, workspaceSlug: string) => void;
}

export function WorkflowCard({ workflow, onGetEmbedCode }: WorkflowCardProps) {
  const router = useRouter();

  function formatTimeAgo(dateString: string | null): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  const isActive = workflow.status === 'active';
  const hasFields = workflow.fieldCount > 0;

  return (
    <div className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-150 hover:border-neutral-300 hover:shadow-md sm:p-6 lg:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 text-xl opacity-80 sm:text-2xl">📝</div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <h3 className="truncate text-base font-semibold text-neutral-900 sm:text-[18px] lg:text-[18px]">
                {workflow.name}
              </h3>
              {/* Status Badge */}
              <span
                className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium sm:px-3 sm:text-[12px] ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-green-500' : 'bg-neutral-400'
                  }`}
                />
                {isActive ? 'Active' : 'Draft'}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 sm:gap-3 sm:text-[13px]">
              <span className="whitespace-nowrap">
                Form trigger · {workflow.fieldCount} fields
              </span>
              <span className="hidden text-neutral-300 sm:inline">·</span>
              <span className="whitespace-nowrap">
                {workflow.totalExecutions} submissions
              </span>
              <span className="hidden text-neutral-300 sm:inline">·</span>
              <span className="whitespace-nowrap">
                Last run {formatTimeAgo(workflow.lastExecutedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* More Options */}
        <button className="hidden flex-shrink-0 rounded-lg p-2 opacity-0 transition-colors group-hover:opacity-100 hover:bg-neutral-100 sm:block">
          <MoreVertical className="h-5 w-5 text-neutral-600" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col flex-wrap gap-2 sm:flex-row lg:flex-row">
        {isActive && hasFields ? (
          <>
            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(workflow.publicFormUrl, '_blank')}
              className="w-full sm:w-auto lg:w-auto"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            {/* Get Embed Code Button - Primary CTA */}
            <Button
              size="sm"
              onClick={() =>
                onGetEmbedCode(workflow.workflowId, workflow.workspaceSlug)
              }
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
            >
              <Code2 className="h-4 w-4" />
              Get Embed Code
            </Button>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/workflows/${workflow.workflowId}`)}
              className="w-full sm:w-auto lg:w-auto"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </>
        ) : !isActive ? (
          <>
            {/* Activate First */}
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto lg:w-auto"
            >
              Activate First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/workflows/${workflow.workflowId}`)}
              className="w-full sm:w-auto lg:w-auto"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </>
        ) : (
          <>
            {/* No fields configured */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/workflows/${workflow.workflowId}`)}
              className="w-full sm:w-auto lg:w-auto"
            >
              <Edit className="h-4 w-4" />
              Configure Fields
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
