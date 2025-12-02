import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableFormField } from './DraggableFormField';
import type { FormField } from '../types/form-fields';

interface DraggableFormFieldListProps {
  fields: FormField[];
  selectedFieldId?: string;
  onFieldClick: (fieldId: string) => void;
  onReorder: (reorderedFields: FormField[]) => void;
  onDelete: (fieldId: string) => void;
}

export function DraggableFormFieldList({
  fields,
  selectedFieldId,
  onFieldClick,
  onReorder,
  onDelete,
}: DraggableFormFieldListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      const reorderedFields = arrayMove(fields, oldIndex, newIndex);

      // Update displayOrder based on new positions
      const fieldsWithUpdatedOrder = reorderedFields.map((field, index) => ({
        ...field,
        displayOrder: index,
      }));

      onReorder(fieldsWithUpdatedOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {fields.map((field) => (
            <DraggableFormField
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onClick={() => onFieldClick(field.id)}
              onDelete={() => onDelete(field.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
