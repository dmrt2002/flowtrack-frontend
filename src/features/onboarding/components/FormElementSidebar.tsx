'use client';

import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { FormField } from '../types/form-fields';

interface FormElementSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: 'header' | 'description' | 'field' | null;
  formHeader: string | null;
  formDescription: string | null;
  showFormHeader?: boolean;
  showFormDescription?: boolean;
  selectedField?: FormField | null;
  onUpdateHeader: (html: string, json: any) => void;
  onUpdateDescription: (html: string, json: any) => void;
  onUpdateField?: (fieldId: string, updates: Partial<FormField>) => void;
  onToggleHeader?: (show: boolean) => void;
  onToggleDescription?: (show: boolean) => void;
}

export function FormElementSidebar({
  isOpen,
  onClose,
  elementType,
  formHeader,
  formDescription,
  showFormHeader = true,
  showFormDescription = true,
  selectedField,
  onUpdateHeader,
  onUpdateDescription,
  onUpdateField,
  onToggleHeader,
  onToggleDescription,
}: FormElementSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="animate-slide-in-right fixed top-0 right-0 z-50 flex h-full w-96 flex-col overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            {elementType === 'header' && 'Edit Header'}
            {elementType === 'description' && 'Edit Description'}
            {elementType === 'field' && 'Edit Field'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {elementType === 'header' && (
            <>
              <div>
                {onToggleHeader && (
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Header Text</Label>
                    <button
                      onClick={() => onToggleHeader(!showFormHeader)}
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      {showFormHeader ? (
                        <>
                          <Eye size={14} />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Hidden
                        </>
                      )}
                    </button>
                  </div>
                )}
                <RichTextEditor
                  value={formHeader || '<h1>Book now</h1>'}
                  onChange={onUpdateHeader}
                  placeholder="Enter form header..."
                  minHeight="150px"
                  maxHeight="300px"
                />
              </div>
              <p className="text-sm text-neutral-600">
                The header appears at the top of your form. Use it to grab
                attention and set expectations.
              </p>
            </>
          )}

          {elementType === 'description' && (
            <>
              <div>
                {onToggleDescription && (
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Description Text</Label>
                    <button
                      onClick={() => onToggleDescription(!showFormDescription)}
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      {showFormDescription ? (
                        <>
                          <Eye size={14} />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Hidden
                        </>
                      )}
                    </button>
                  </div>
                )}
                <RichTextEditor
                  value={
                    formDescription ||
                    "<p>We'd love to hear from you! Please fill out the form and we'll get back to you.</p>"
                  }
                  onChange={onUpdateDescription}
                  placeholder="Enter form description..."
                  minHeight="150px"
                  maxHeight="300px"
                />
              </div>
              <p className="text-sm text-neutral-600">
                The description provides context about your form. Tell users
                what to expect after submitting.
              </p>
            </>
          )}

          {elementType === 'field' && selectedField && onUpdateField && (
            <div className="space-y-4">
              <div>
                <Label>Field Label</Label>
                <Input
                  value={selectedField.label}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, { label: e.target.value })
                  }
                  placeholder="e.g., Email Address"
                />
              </div>

              <div>
                <Label>Field Key</Label>
                <Input
                  value={selectedField.fieldKey}
                  disabled
                  className="bg-neutral-50"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Field key cannot be changed after creation
                </p>
              </div>

              <div>
                <Label>Field Type</Label>
                <Input
                  value={selectedField.fieldType}
                  disabled
                  className="bg-neutral-50"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Field type cannot be changed after creation
                </p>
              </div>

              <div>
                <Label>Placeholder</Label>
                <Input
                  value={selectedField.placeholder || ''}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="e.g., Enter your email"
                />
              </div>

              <div>
                <Label>Help Text</Label>
                <Textarea
                  value={selectedField.helpText || ''}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      helpText: e.target.value,
                    })
                  }
                  placeholder="Additional guidance for this field"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedField.isRequired}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      isRequired: e.target.checked,
                    })
                  }
                  className="rounded border-neutral-300"
                />
                <label htmlFor="required" className="text-sm text-neutral-700">
                  Required field
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
