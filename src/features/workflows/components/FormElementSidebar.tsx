import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FormField, WorkflowFormFields } from '../types/workflow';

interface FormElementSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: 'header' | 'description' | 'field' | 'addField' | null;
  formData: WorkflowFormFields;
  selectedFieldId?: string;
  onUpdateHeader: (html: string, json: any) => void;
  onUpdateDescription: (html: string, json: any) => void;
  onToggleHeader: (show: boolean) => void;
  onToggleDescription: (show: boolean) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onAddField: (newField: Omit<FormField, 'id'>) => void;
}

export function FormElementSidebar({
  isOpen,
  onClose,
  elementType,
  formData,
  selectedFieldId,
  onUpdateHeader,
  onUpdateDescription,
  onToggleHeader,
  onToggleDescription,
  onUpdateField,
  onAddField,
}: FormElementSidebarProps) {
  const selectedField = formData.fields.find((f) => f.id === selectedFieldId);

  // State for adding new field
  const [newFieldData, setNewFieldData] = React.useState({
    fieldKey: '',
    label: '',
    fieldType: 'TEXT',
    placeholder: '',
    helpText: '',
    isRequired: false,
    displayOrder: formData.fields.length,
  });

  // Reset new field data when opening add field panel
  React.useEffect(() => {
    if (elementType === 'addField') {
      setNewFieldData({
        fieldKey: '',
        label: '',
        fieldType: 'TEXT',
        placeholder: '',
        helpText: '',
        isRequired: false,
        displayOrder: formData.fields.length,
      });
    }
  }, [elementType, formData.fields.length]);

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
            {elementType === 'addField' && 'Add Field'}
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
                <div className="mb-2 flex items-center justify-between">
                  <Label>Header Text</Label>
                  <button
                    onClick={() =>
                      onToggleHeader(
                        !(formData.settings?.showFormHeader ?? true)
                      )
                    }
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {formData.settings?.showFormHeader !== false ? (
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
                <RichTextEditor
                  value={formData.settings?.formHeader || '<h1>Contact Us</h1>'}
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
                <div className="mb-2 flex items-center justify-between">
                  <Label>Description Text</Label>
                  <button
                    onClick={() =>
                      onToggleDescription(
                        !(formData.settings?.showFormDescription ?? true)
                      )
                    }
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {formData.settings?.showFormDescription !== false ? (
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
                <RichTextEditor
                  value={
                    formData.settings?.formDescription ||
                    "<p>We'd love to hear from you! Please fill out the form and we'll get back to you as soon as possible.</p>"
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

          {elementType === 'field' && selectedField && (
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

          {elementType === 'addField' && (
            <div className="space-y-4">
              <div>
                <Label>Field Label *</Label>
                <Input
                  value={newFieldData.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    const fieldKey = label
                      .toLowerCase()
                      .replace(/\s+/g, '_')
                      .replace(/[^a-z0-9_]/g, '');
                    setNewFieldData({ ...newFieldData, label, fieldKey });
                  }}
                  placeholder="e.g., Phone Number"
                />
              </div>

              <div>
                <Label>Field Key</Label>
                <Input
                  value={newFieldData.fieldKey}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
                      fieldKey: e.target.value,
                    })
                  }
                  placeholder="e.g., phone_number"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Used internally to identify this field
                </p>
              </div>

              <div>
                <Label>Field Type *</Label>
                <Select
                  value={newFieldData.fieldType}
                  onValueChange={(value) =>
                    setNewFieldData({ ...newFieldData, fieldType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="NUMBER">Number</SelectItem>
                    <SelectItem value="TEXTAREA">Textarea</SelectItem>
                    <SelectItem value="DATE">Date</SelectItem>
                    <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                    <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Placeholder</Label>
                <Input
                  value={newFieldData.placeholder}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="e.g., Enter your phone number"
                />
              </div>

              <div>
                <Label>Help Text</Label>
                <Textarea
                  value={newFieldData.helpText}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
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
                  id="required-new"
                  checked={newFieldData.isRequired}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
                      isRequired: e.target.checked,
                    })
                  }
                  className="rounded border-neutral-300"
                />
                <label
                  htmlFor="required-new"
                  className="text-sm text-neutral-700"
                >
                  Required field
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4">
          {elementType === 'addField' ? (
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newFieldData.label && newFieldData.fieldKey) {
                    onAddField(newFieldData);
                  }
                }}
                disabled={!newFieldData.label || !newFieldData.fieldKey}
                className="flex-1"
              >
                Add Field
              </Button>
            </div>
          ) : (
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
