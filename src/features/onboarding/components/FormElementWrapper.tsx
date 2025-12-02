import React from 'react';
import { Edit2 } from 'lucide-react';

interface FormElementWrapperProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

export function FormElementWrapper({
  children,
  isSelected,
  onClick,
  label,
}: FormElementWrapperProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        isSelected
          ? 'bg-indigo-50/30 ring-2 ring-indigo-500'
          : 'hover:bg-indigo-50/10 hover:ring-2 hover:ring-indigo-300'
      }`}
    >
      {/* Edit Icon Overlay */}
      <div
        className={`absolute -top-3 right-0 z-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white shadow-lg">
          <Edit2 size={14} />
          <span>Edit {label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">{children}</div>
    </div>
  );
}
