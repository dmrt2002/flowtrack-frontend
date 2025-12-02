import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { FormElementWrapper } from './FormElementWrapper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormField } from '../types/form-fields';

interface DraggableFormFieldProps {
  field: FormField;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

// Default fields that cannot be deleted
const DEFAULT_FIELD_KEYS = ['name', 'email', 'companyName'];

const isDefaultField = (fieldKey: string): boolean => {
  return DEFAULT_FIELD_KEYS.includes(fieldKey);
};

export function DraggableFormField({
  field,
  isSelected,
  onClick,
  onDelete,
}: DraggableFormFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderFieldInput = () => {
    const commonClasses =
      'w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 disabled:cursor-not-allowed';

    switch (field.fieldType) {
      case 'TEXTAREA':
        return (
          <Textarea
            placeholder={field.placeholder || field.label}
            disabled
            rows={3}
            className={commonClasses}
          />
        );
      case 'EMAIL':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || field.label}
            disabled
            className={commonClasses}
          />
        );
      case 'NUMBER':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || field.label}
            disabled
            className={commonClasses}
          />
        );
      case 'DATE':
        return <Input type="date" disabled className={commonClasses} />;
      case 'CHECKBOX':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled
              className="rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700">{field.label}</span>
          </div>
        );
      case 'DROPDOWN':
        return (
          <select disabled className={commonClasses}>
            <option>{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || field.label}
            disabled
            className={commonClasses}
          />
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <FormElementWrapper
        isSelected={isSelected}
        onClick={onClick}
        label="Field"
      >
        <div className="relative flex items-start gap-3">
          {/* Drag Handle */}
          {!isDefaultField(field.fieldKey) && (
            <div
              {...attributes}
              {...listeners}
              className="mt-8 cursor-grab text-neutral-400 hover:text-neutral-600 active:cursor-grabbing"
            >
              <GripVertical size={20} />
            </div>
          )}

          {/* Field Content */}
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-neutral-700">
              {field.label}
              {field.isRequired && <span className="ml-1 text-red-500">*</span>}
            </label>
            {field.helpText && (
              <p className="text-xs text-neutral-500">{field.helpText}</p>
            )}
            <div className="mt-2">{renderFieldInput()}</div>
          </div>

          {/* Delete Button - Appears on Hover (only for non-default fields) */}
          {!isDefaultField(field.fieldKey) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete field "${field.label}"?`)) {
                  onDelete();
                }
              }}
              className="absolute top-1 right-12 z-10 rounded-md bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
              title="Delete field"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </FormElementWrapper>
    </div>
  );
}
