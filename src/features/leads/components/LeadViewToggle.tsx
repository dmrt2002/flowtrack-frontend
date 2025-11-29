'use client';

import { LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeadView } from '../types/lead';

interface LeadViewToggleProps {
  view: LeadView;
  onViewChange: (view: LeadView) => void;
}

export function LeadViewToggle({ view, onViewChange }: LeadViewToggleProps) {
  return (
    <div className="flex w-full items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 sm:w-auto lg:w-auto">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="flex-1 gap-1 sm:flex-initial sm:gap-2 lg:flex-initial lg:gap-2"
      >
        <Table className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
        <span className="text-xs sm:text-sm lg:text-sm">Table</span>
      </Button>
      <Button
        variant={view === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('kanban')}
        className="flex-1 gap-1 sm:flex-initial sm:gap-2 lg:flex-initial lg:gap-2"
      >
        <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
        <span className="text-xs sm:text-sm lg:text-sm">Kanban</span>
      </Button>
    </div>
  );
}
