'use client';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Mail, Building2 } from 'lucide-react';
import type { LeadStatus, KanbanColumn } from '../types/lead';
import { LEAD_STATUS_LABELS } from '../types/lead';
import {
  getKanbanColumnColor,
  getSourceColor,
  getScoreColor,
  formatSourceLabel,
} from '../utils/lead-status-colors';

interface LeadsKanbanProps {
  columns: KanbanColumn[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onViewLead: (leadId: string) => void;
}

export function LeadsKanban({
  columns,
  onStatusChange,
  onViewLead,
}: LeadsKanbanProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const newStatus = destination.droppableId as LeadStatus;
    const leadId = draggableId;

    onStatusChange(leadId, newStatus);
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

  if (columns.length === 0) {
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-6 gap-3 pb-4">
        {columns.map((column) => {
          const columnColor = getKanbanColumnColor(column.status);

          return (
            <div
              key={column.status}
              className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50"
            >
              {/* Column Header */}
              <div className={`border-b-2 p-3 ${columnColor} rounded-t-xl`}>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-900">
                    {LEAD_STATUS_LABELS[column.status]}
                  </h3>
                  <span className="flex-shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {column.count}
                  </span>
                </div>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`max-h-[calc(100vh-280px)] min-h-[500px] overflow-y-auto p-2 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {column.leads.map((lead, index) => {
                      const sourceColors = getSourceColor(lead.source);
                      const scoreColors = getScoreColor(lead.score);

                      return (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 cursor-grab rounded-lg border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-md ${
                                snapshot.isDragging
                                  ? 'opacity-90 shadow-lg'
                                  : ''
                              }`}
                            >
                              {/* Lead Header */}
                              <div className="mb-2 flex items-start gap-2">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                                  {getInitials(lead.name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium text-neutral-900">
                                    {lead.name || 'Unknown'}
                                  </div>
                                  <div className="flex items-center gap-1 truncate text-xs text-neutral-500">
                                    <Mail className="h-3 w-3" />
                                    {lead.email}
                                  </div>
                                </div>
                              </div>

                              {/* Company Name (if exists) */}
                              {lead.companyName && (
                                <div className="mb-2 flex items-center gap-1 text-xs text-neutral-600">
                                  <Building2 className="h-3 w-3 flex-shrink-0 text-neutral-400" />
                                  <span className="truncate">
                                    {lead.companyName}
                                  </span>
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span
                                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${sourceColors.bg} ${sourceColors.text} truncate`}
                                >
                                  {formatSourceLabel(lead.source)}
                                </span>
                                <div
                                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${scoreColors.bg} ${scoreColors.text} flex-shrink-0`}
                                >
                                  {lead.score}
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                                <div className="truncate text-xs text-neutral-500">
                                  {lead.lastActivityAt
                                    ? formatDistanceToNow(
                                        new Date(lead.lastActivityAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )
                                    : formatDistanceToNow(
                                        new Date(lead.createdAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewLead(lead.id);
                                  }}
                                  className="text-primary hover:text-primary-dark flex-shrink-0 transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {/* Show message if column has more leads than displayed */}
                    {column.count > column.leads.length && (
                      <div className="py-4 text-center">
                        <p className="text-sm text-neutral-500">
                          Showing {column.leads.length} of {column.count} leads
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          Use filters to find specific leads
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
