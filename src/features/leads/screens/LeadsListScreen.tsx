'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { LeadMetricsCards } from '../components/LeadMetricsCards';
import { LeadFiltersBar } from '../components/LeadFiltersBar';
import { LeadViewToggle } from '../components/LeadViewToggle';
import { LeadsTable } from '../components/LeadsTable';
import { LeadsKanban } from '../components/LeadsKanban';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { useCurrentUser } from '@/store/currentUserStore';
import {
  useLeads,
  useLeadDetails,
  useLeadMetrics,
  useUpdateLeadStatus,
  useDeleteLead,
} from '../hooks/use-leads';
import type { LeadFilters, LeadView, LeadStatus } from '../types/lead';

export function LeadsListScreen() {
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const workspaceId = currentUser?.workspaces?.[0]?.id || '';

  const [view, setView] = useState<LeadView>('table');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [filters, setFilters] = useState<LeadFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Fetch data
  const {
    data: leadsData,
    isLoading,
    error,
  } = useLeads(workspaceId, {
    ...filters,
    page,
    limit,
    view,
  });
  const { data: metricsData, isLoading: metricsLoading } = useLeadMetrics(
    workspaceId,
    '30d'
  );
  const { data: selectedLeadData } = useLeadDetails(
    workspaceId,
    selectedLeadId
  );

  const deleteMutation = useDeleteLead();
  const updateStatusMutation = useUpdateLeadStatus();

  const leads = leadsData && leadsData.view === 'table' ? leadsData.leads : [];
  const total = leadsData && leadsData.view === 'table' ? leadsData.total : 0;
  const kanbanColumns =
    leadsData && leadsData.view === 'kanban' ? leadsData.columns : [];

  const handleViewLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleEditLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await deleteMutation.mutateAsync({ workspaceId, leadId });
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        workspaceId,
        leadId,
        dto: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const handleExportAll = () => {
    // TODO: Implement export all functionality
    console.log('Exporting all leads with filters:', filters);
  };

  const showLoading = isLoadingUser || isLoading;
  const showError = !showLoading && error;
  const showContent = !showLoading && !error;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[32px] lg:text-[32px]">
              Leads
            </h1>
            <p className="text-sm text-neutral-600 sm:text-[15px] lg:text-[15px]">
              Manage and track all your leads
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <LeadViewToggle view={view} onViewChange={setView} />
            <Button
              size="lg"
              onClick={handleExportAll}
              variant="outline"
              className="w-full sm:w-auto lg:w-auto"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Export All</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {showLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-neutral-200 bg-white p-6"
                >
                  <div className="mb-4 h-4 w-1/2 rounded bg-neutral-200" />
                  <div className="h-8 w-3/4 rounded bg-neutral-200" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {showError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-600">Failed to load leads</p>
            <p className="mt-2 text-sm text-red-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {/* Content */}
        {showContent && (
          <>
            {/* Metrics */}
            <LeadMetricsCards
              metrics={metricsData}
              isLoading={metricsLoading}
            />

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              <LeadFiltersBar filters={filters} onFiltersChange={setFilters} />
            </motion.div>

            {/* Leads Table View */}
            {view === 'table' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                }}
              >
                <LeadsTable
                  leads={leads}
                  total={total}
                  page={page}
                  limit={limit}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                  onViewLead={handleViewLead}
                  onEditLead={handleEditLead}
                  onDeleteLead={handleDeleteLead}
                />
              </motion.div>
            )}

            {/* Leads Kanban View */}
            {view === 'kanban' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                }}
              >
                <LeadsKanban
                  columns={kanbanColumns}
                  onStatusChange={handleStatusChange}
                  onViewLead={handleViewLead}
                />
              </motion.div>
            )}
          </>
        )}

        {/* Lead Detail Modal */}
        {selectedLeadData && (
          <LeadDetailModal
            lead={selectedLeadData}
            workspaceId={workspaceId}
            open={!!selectedLeadId}
            onOpenChange={(open) => !open && setSelectedLeadId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
