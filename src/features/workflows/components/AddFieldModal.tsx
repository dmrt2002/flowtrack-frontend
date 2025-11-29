'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FormField } from '../types/workflow';

interface AddFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (field: Omit<FormField, 'id'>) => void;
  editingField?: FormField | null;
  existingFields: FormField[];
}

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text', icon: '📝' },
  { value: 'EMAIL', label: 'Email', icon: '✉️' },
  { value: 'PHONE', label: 'Phone', icon: '📞' },
  { value: 'NUMBER', label: 'Number', icon: '🔢' },
  { value: 'TEXTAREA', label: 'Textarea', icon: '📄' },
  { value: 'SELECT', label: 'Select/Dropdown', icon: '📋' },
  { value: 'CHECKBOX', label: 'Checkbox', icon: '☑️' },
  { value: 'RADIO', label: 'Radio Buttons', icon: '🔘' },
  { value: 'DATE', label: 'Date', icon: '📅' },
  { value: 'URL', label: 'URL', icon: '🔗' },
];

export function AddFieldModal({
  open,
  onOpenChange,
  onAdd,
  editingField,
  existingFields,
}: AddFieldModalProps) {
  const [fieldKey, setFieldKey] = useState('');
  const [label, setLabel] = useState('');
  const [fieldType, setFieldType] = useState('TEXT');
  const [isRequired, setIsRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [helpText, setHelpText] = useState('');

  const isEditing = !!editingField;

  // Load editing field data
  useEffect(() => {
    if (editingField) {
      setFieldKey(editingField.fieldKey);
      setLabel(editingField.label);
      setFieldType(editingField.fieldType);
      setIsRequired(editingField.isRequired);
      setPlaceholder(editingField.placeholder || '');
      setHelpText(editingField.helpText || '');
    } else if (open) {
      // Reset form when opening for new field
      setFieldKey('');
      setLabel('');
      setFieldType('TEXT');
      setIsRequired(false);
      setPlaceholder('');
      setHelpText('');
    }
  }, [editingField, open]);

  // Auto-generate fieldKey from label
  const generateFieldKey = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  };

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (!isEditing) {
      const generatedKey = generateFieldKey(value);
      setFieldKey(generatedKey);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim() || !fieldKey.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for duplicate fieldKey (only when adding or if key changed during edit)
    if (!isEditing || fieldKey !== editingField.fieldKey) {
      const isDuplicate = existingFields.some((f) => f.fieldKey === fieldKey);
      if (isDuplicate) {
        alert(
          'A field with this key already exists. Please use a different key.'
        );
        return;
      }
    }

    const newField: Omit<FormField, 'id'> = {
      fieldKey,
      label,
      fieldType,
      isRequired,
      placeholder: placeholder || undefined,
      helpText: helpText || undefined,
      displayOrder: isEditing
        ? editingField.displayOrder
        : existingFields.length + 1,
      validationRules: {},
    };

    onAdd(newField);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-[560px] flex-col gap-0 overflow-hidden bg-white p-0">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Edit Field' : 'Add Form Field'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            {isEditing
              ? 'Update the field configuration below.'
              : 'Configure a new field for your form.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            id="field-editor-form"
          >
            {/* Field Type */}
            <div className="space-y-2">
              <Label htmlFor="fieldType" className="text-sm font-medium">
                Field Type <span className="text-red-500">*</span>
              </Label>
              <Select value={fieldType} onValueChange={setFieldType}>
                <SelectTrigger id="fieldType" className="w-full">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field Label */}
            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Field Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g., Full Name"
                required
                className="w-full"
              />
            </div>

            {/* Field Key */}
            <div className="space-y-2">
              <Label htmlFor="fieldKey" className="text-sm font-medium">
                Field Key <span className="text-red-500">*</span>
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  (Auto-generated, used in variables)
                </span>
              </Label>
              <Input
                id="fieldKey"
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
                placeholder="e.g., full_name"
                required
                disabled={isEditing}
                className={cn(
                  'w-full font-mono text-sm',
                  isEditing && 'opacity-60'
                )}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                This will be available as{' '}
                <code className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs">
                  {`{${fieldKey || 'fieldKey'}}`}
                </code>{' '}
                in email templates
              </p>
            </div>

            {/* Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="placeholder" className="text-sm font-medium">
                Placeholder Text
              </Label>
              <Input
                id="placeholder"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full"
              />
            </div>

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="helpText" className="text-sm font-medium">
                Help Text
              </Label>
              <Textarea
                id="helpText"
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="Additional instructions or guidance for this field"
                rows={2}
                className="w-full resize-none"
              />
            </div>

            {/* Required Toggle */}
            <div className="bg-muted/50 hover:bg-muted/70 flex items-start gap-3 rounded-lg p-4 transition-colors">
              <input
                type="checkbox"
                id="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="border-input bg-background accent-primary mt-0.5 h-5 w-5 cursor-pointer rounded border-2 transition-colors"
              />
              <div className="flex-1">
                <Label
                  htmlFor="isRequired"
                  className="cursor-pointer text-sm font-medium"
                >
                  Required field
                </Label>
                <p className="text-muted-foreground mt-1 text-xs">
                  Leads must fill this field to submit
                </p>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="bg-muted/30 shrink-0 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="field-editor-form">
            {isEditing ? 'Update Field' : 'Add Field'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
