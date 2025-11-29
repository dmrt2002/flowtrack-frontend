'use client';

import { useState } from 'react';
import { X, Tag, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onChangeStatus: (status: string) => void;
  onAddTags: (tags: string[]) => void;
  onExport: () => void;
  onDelete: () => void;
}

const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'NURTURING',
  'WON',
  'LOST',
  'DISQUALIFIED',
];

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onChangeStatus,
  onExport,
  onDelete,
}: BulkActionsBarProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (selectedCount === 0) return null;

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onChangeStatus(value);
    // Reset after action
    setTimeout(() => setSelectedStatus(''), 100);
  };

  return (
    <div className="sticky top-0 z-10 rounded-xl border border-indigo-700 bg-indigo-600 p-4 shadow-lg">
      <div className="flex items-center gap-4">
        {/* Selection count */}
        <div className="flex items-center gap-2 text-white">
          <span className="font-medium">{selectedCount} selected</span>
          <button
            onClick={onClearSelection}
            className="rounded p-1 transition-colors hover:bg-indigo-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-indigo-400" />

        {/* Change Status */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-indigo-200" />
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Change status..." />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            className="bg-white hover:bg-neutral-100"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
