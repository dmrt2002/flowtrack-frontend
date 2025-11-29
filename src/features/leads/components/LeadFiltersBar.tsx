'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LeadFilters, LeadSource, LeadStatus } from '../types/lead';
import { LEAD_STATUS_LABELS } from '../types/lead';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  workflows?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
}

const LEAD_SOURCES: LeadSource[] = [
  'FORM',
  'EMAIL_FORWARD',
  'API',
  'MANUAL',
  'IMPORT',
];

const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'EMAIL_SENT',
  'EMAIL_OPENED',
  'FOLLOW_UP_PENDING',
  'FOLLOW_UP_SENT',
  'RESPONDED',
  'BOOKED',
  'WON',
  'LOST',
  'DISQUALIFIED',
];

export function LeadFiltersBar({
  filters,
  onFiltersChange,
  workflows = [],
}: LeadFiltersBarProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleWorkflowChange = (value: string) => {
    onFiltersChange({
      ...filters,
      workflowId: value === 'all' ? undefined : value,
    });
  };

  const handleSourceChange = (value: string) => {
    onFiltersChange({
      ...filters,
      source: value === 'all' ? undefined : (value as LeadSource),
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as LeadStatus),
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.workflowId ||
    filters.source ||
    filters.status ||
    filters.tags?.length ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row lg:flex-row">
        {/* Search */}
        <div className="relative w-full flex-1 sm:min-w-[200px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-neutral-400" />
          <Input
            placeholder="Search by name, email, or company..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Workflow Filter */}
          <Select
            value={filters.workflowId || 'all'}
            onValueChange={handleWorkflowChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] lg:w-[180px]">
              <SelectValue placeholder="All Workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select
            value={filters.source || 'all'}
            onValueChange={handleSourceChange}
          >
            <SelectTrigger className="w-full sm:w-[150px] lg:w-[150px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {LEAD_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {source.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] lg:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="w-full sm:w-auto lg:ml-auto lg:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
