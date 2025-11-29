'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Lead, LeadFilters } from '../types/lead';
import { LEAD_STATUS_LABELS } from '../types/lead';
import {
  getStatusColor,
  getSourceColor,
  getScoreColor,
  formatSourceLabel,
} from '../utils/lead-status-colors';

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewLead: (leadId: string) => void;
  onEditLead: (leadId: string) => void;
  onDeleteLead: (leadId: string) => void;
}

export function LeadsTable({
  leads,
  total,
  page,
  limit,
  filters,
  onFiltersChange,
  onPageChange,
  onLimitChange,
  onViewLead,
  onEditLead,
  onDeleteLead,
}: LeadsTableProps) {
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const handleSort = (sortBy: LeadFilters['sortBy']) => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === 'desc'
        ? 'asc'
        : 'desc';
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: newSortOrder,
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (leads.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-neutral-600">No leads found</p>
            <p className="text-sm text-neutral-500">
              Try adjusting your filters or create a new workflow to start
              capturing leads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="-mx-4 overflow-x-auto sm:mx-0 lg:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm lg:p-3 lg:text-sm">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-neutral-900"
                  >
                    Lead
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                  </button>
                </th>
                <th className="hidden p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:table-cell sm:p-3 sm:text-sm lg:p-3 lg:text-sm">
                  Company
                </th>
                <th className="hidden p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm lg:table-cell lg:p-3 lg:text-sm">
                  Workflow
                </th>
                <th className="p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm lg:p-3 lg:text-sm">
                  Source
                </th>
                <th className="p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm lg:p-3 lg:text-sm">
                  Status
                </th>
                <th className="hidden p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm md:table-cell lg:p-3 lg:text-sm">
                  <button
                    onClick={() => handleSort('score')}
                    className="flex items-center gap-1 hover:text-neutral-900"
                  >
                    Score
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                  </button>
                </th>
                <th className="hidden p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm lg:table-cell lg:p-3 lg:text-sm">
                  <button
                    onClick={() => handleSort('lastActivityAt')}
                    className="flex items-center gap-1 hover:text-neutral-900"
                  >
                    Last Activity
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                  </button>
                </th>
                <th className="hidden p-2 text-left text-xs font-medium whitespace-nowrap text-neutral-700 sm:p-3 sm:text-sm md:table-cell lg:p-3 lg:text-sm">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-neutral-900"
                  >
                    Created
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                  </button>
                </th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const statusColors = getStatusColor(lead.status);
                const sourceColors = getSourceColor(lead.source);
                const scoreColors = getScoreColor(lead.score);

                return (
                  <tr
                    key={lead.id}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="p-2 sm:p-3 lg:p-3">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600 sm:h-10 sm:w-10 sm:text-sm lg:h-10 lg:w-10 lg:text-sm">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-neutral-900 sm:text-base lg:text-base">
                            {lead.name || 'Unknown'}
                          </div>
                          <div className="truncate text-xs text-neutral-500 sm:text-sm lg:text-sm">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-2 text-xs text-neutral-700 sm:table-cell sm:p-3 sm:text-sm lg:p-3 lg:text-sm">
                      {lead.companyName || '-'}
                    </td>
                    <td className="hidden p-2 sm:p-3 lg:table-cell lg:p-3">
                      <span className="text-xs text-neutral-700 sm:text-sm lg:text-sm">
                        {lead.workflow?.name || '-'}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 lg:p-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${sourceColors.bg} ${sourceColors.text}`}
                      >
                        {formatSourceLabel(lead.source)}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 lg:p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusColors.dot}`}
                        />
                        <span className="hidden sm:inline lg:inline">
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                        <span className="sm:hidden lg:hidden">
                          {LEAD_STATUS_LABELS[lead.status].split(' ')[0]}
                        </span>
                      </span>
                    </td>
                    <td className="hidden p-2 sm:p-3 md:table-cell lg:p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded px-2 py-1 text-xs font-medium ${scoreColors.bg} ${scoreColors.text}`}
                        >
                          {lead.score}
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-2 text-xs text-neutral-600 sm:p-3 sm:text-sm lg:table-cell lg:p-3 lg:text-sm">
                      {lead.lastActivityAt
                        ? formatDistanceToNow(new Date(lead.lastActivityAt), {
                            addSuffix: true,
                          })
                        : '-'}
                    </td>
                    <td className="hidden p-2 text-xs text-neutral-600 sm:p-3 sm:text-sm md:table-cell lg:p-3 lg:text-sm">
                      {formatDistanceToNow(new Date(lead.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="p-2 sm:p-3 lg:p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewLead(lead.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditLead(lead.id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteLead(lead.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-neutral-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:px-6 lg:py-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600 sm:text-sm lg:text-sm">
            <span className="hidden sm:inline lg:inline">Showing</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="focus:ring-primary rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 focus:border-transparent focus:ring-2 focus:outline-none sm:text-sm lg:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              <span className="sm:hidden lg:hidden">of {total}</span>
              <span className="hidden sm:inline lg:inline">
                of {total} lead{total !== 1 ? 's' : ''}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end lg:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="text-xs sm:text-sm lg:text-sm"
            >
              Previous
            </Button>
            <span className="min-w-[80px] text-center text-xs text-neutral-600 sm:min-w-[100px] sm:text-sm lg:min-w-[100px] lg:text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || totalPages === 0}
              className="text-xs sm:text-sm lg:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
