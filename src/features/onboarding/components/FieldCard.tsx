'use client';

import { Lock, Info, GripVertical, Edit, X, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { FormField } from '../types/form-fields';

interface FieldCardProps {
  field: FormField;
  isDefault?: boolean;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const fieldTypeLabels: Record<FormField['fieldType'], string> = {
  TEXT: 'Text',
  EMAIL: 'Email',
  NUMBER: 'Number',
  DROPDOWN: 'Dropdown',
  TEXTAREA: 'Textarea',
  DATE: 'Date',
  CHECKBOX: 'Checkbox',
};

export function FieldCard({
  field,
  isDefault = false,
  isDragging = false,
  onEdit,
  onDelete,
  dragHandleProps,
}: FieldCardProps) {
  const getFieldMetadata = () => {
    const metadata: string[] = [];
    if (field.isRequired) metadata.push('Required');
    metadata.push(fieldTypeLabels[field.fieldType]);
    if (field.fieldType === 'DROPDOWN' && field.options) {
      metadata.push(`${field.options.length} options`);
    }
    return metadata;
  };

  const generateVariable = (fieldKey: string) => {
    return `{${fieldKey}}`;
  };

  if (isDefault) {
    return (
      <div
        className={cn(
          'border-muted bg-muted/50 relative w-full rounded-lg border-2 p-4 opacity-90',
          'cursor-not-allowed'
        )}
        role="article"
        aria-label={`${field.label} field - locked default field`}
      >
        <Lock className="text-muted-foreground absolute top-4 left-4 h-4 w-4" />
        <Info className="text-muted-foreground absolute top-4 right-4 h-4 w-4 cursor-help" />

        <div className="ml-6">
          <h3 className="text-foreground text-sm font-semibold">
            {field.label}
          </h3>
          {field.helpText && (
            <p className="text-muted-foreground mt-1 text-xs">
              {field.helpText}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {getFieldMetadata().map((meta, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wider uppercase"
              >
                {meta}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group border-border bg-card relative w-full rounded-lg border-2 p-3 shadow-sm transition-all duration-150 sm:p-4',
        isDragging && 'rotate-[2deg] cursor-grabbing opacity-60 shadow-lg',
        !isDragging && 'cursor-grab'
      )}
      role="article"
      aria-label={`${field.label} ${fieldTypeLabels[field.fieldType]} field`}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-1/2 left-3 -translate-y-1/2 cursor-grab active:cursor-grabbing sm:left-4"
          aria-label={`Drag to reorder ${field.label} field`}
        >
          <GripVertical className="text-muted-foreground group-hover:text-primary h-3 w-3 transition-colors sm:h-4 sm:w-4" />
        </div>
      )}

      {/* Action Buttons - Desktop */}
      <div className="absolute top-4 right-4 hidden gap-2 sm:flex">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-primary hover:bg-primary h-7 px-3 text-xs font-medium transition-colors"
            aria-label={`Edit ${field.label} field`}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:bg-destructive h-7 w-7 transition-colors"
            aria-label={`Delete ${field.label} field`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Action Menu - Mobile */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted h-8 w-8"
                aria-label={`More options for ${field.label} field`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Field Content */}
      <div className={cn('mr-12 sm:mr-20', dragHandleProps && 'ml-6 sm:ml-8')}>
        <h3 className="text-foreground text-sm font-semibold">{field.label}</h3>
        {field.helpText && (
          <p className="text-muted-foreground mt-1 text-xs">{field.helpText}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {getFieldMetadata().map((meta, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wider uppercase"
            >
              {meta}
            </span>
          ))}
        </div>
        <div className="bg-primary/10 border-primary/20 mt-2 inline-flex items-center gap-1 rounded-md border px-2 py-1">
          <span className="text-primary font-mono text-xs font-medium">
            {generateVariable(field.fieldKey)}
          </span>
        </div>
      </div>
    </div>
  );
}
