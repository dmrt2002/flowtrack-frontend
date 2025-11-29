'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { WorkflowCard } from '../components/WorkflowCard';
import { EmbedCodeModal } from '@/features/forms/components/EmbedCodeModal';
import { useWorkflows } from '../hooks/use-workflows';
import { useCurrentUser } from '@/store/currentUserStore';

export function WorkflowsListScreen() {
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const workspaceId = currentUser?.workspaces?.[0]?.id || '';

  console.log('WorkflowsListScreen:', {
    currentUser,
    workspaceId,
    isLoadingUser,
  });

  const { data: workflows, isLoading, error } = useWorkflows(workspaceId);

  const [selectedWorkflow, setSelectedWorkflow] = useState<{
    workflowId: string;
    workspaceSlug: string;
  } | null>(null);

  function handleGetEmbedCode(workflowId: string, workspaceSlug: string): void {
    setSelectedWorkflow({ workflowId, workspaceSlug });
  }

  function handleCloseEmbedModal(): void {
    setSelectedWorkflow(null);
  }

  const hasWorkflows = workflows && workflows.length > 0;

  // Get public form URL from active workflow, or construct from workspace slug
  const activeWorkflow = workflows?.find((w) => w.status === 'active');
  const workspaceSlug =
    activeWorkflow?.workspaceSlug ||
    workflows?.[0]?.workspaceSlug ||
    currentUser?.workspaces?.[0]?.slug;

  const frontendUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  const publicFormUrl =
    activeWorkflow?.publicFormUrl ||
    (workspaceSlug ? `${frontendUrl}/p/${workspaceSlug}` : undefined);

  // Show loading if user or workflows are loading
  const showLoading = isLoadingUser || isLoading;
  // Show error only if not loading and there's an error
  const showError = !showLoading && error;
  // Show empty state if not loading, no error, and no workflows
  const showEmpty = !showLoading && !error && !hasWorkflows && !!workspaceId;
  // Show content if we have workflows
  const showContent = !showLoading && !error && hasWorkflows;

  return (
    <DashboardLayout publicFormUrl={publicFormUrl}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[32px] lg:text-[32px]">
              Workflows
            </h1>
            <p className="text-sm text-neutral-600 sm:text-[15px] lg:text-[15px]">
              Manage your automation workflows and embed forms
            </p>
          </div>
          <Button size="lg" className="w-full sm:w-auto lg:w-auto">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Loading State */}
        {showLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-neutral-200 bg-white p-6"
              >
                <div className="mb-4 h-6 w-1/3 rounded bg-neutral-200" />
                <div className="mb-6 h-4 w-2/3 rounded bg-neutral-200" />
                <div className="flex gap-2">
                  <div className="h-9 w-24 rounded bg-neutral-200" />
                  <div className="h-9 w-32 rounded bg-neutral-200" />
                  <div className="h-9 w-20 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {showError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-2 font-medium text-red-600">
              Failed to load workflows
            </p>
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : 'Please try again'}
            </p>
          </div>
        )}

        {/* Workflows List */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="space-y-4"
          >
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.workflowId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + index * 0.1,
                }}
              >
                <WorkflowCard
                  workflow={workflow}
                  onGetEmbedCode={handleGetEmbedCode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {showEmpty && <EmptyState />}

        {/* No workspace warning */}
        {!isLoadingUser && !workspaceId && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="font-medium text-yellow-600">No workspace found</p>
            <p className="mt-1 text-sm text-yellow-500">
              Please contact support if this issue persists
            </p>
          </div>
        )}
      </div>

      {/* Embed Code Modal */}
      {selectedWorkflow && (
        <EmbedCodeModal
          isOpen={true}
          onClose={handleCloseEmbedModal}
          workflowId={selectedWorkflow.workflowId}
          workspaceSlug={selectedWorkflow.workspaceSlug}
        />
      )}
    </DashboardLayout>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <FileText className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mb-2 text-[18px] font-semibold text-neutral-900">
          No embeddable forms yet
        </h3>
        <p className="mb-8 text-[14px] leading-relaxed text-neutral-500">
          Create a workflow with a form trigger to start collecting leads on
          your website
        </p>
        <Button size="lg">
          <Plus className="h-5 w-5" />
          Create Form Workflow
        </Button>
      </div>
    </div>
  );
}
