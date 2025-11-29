'use client';

import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useWorkflowFormFields,
  useSaveFormFields,
} from '../hooks/use-workflow-form-fields';
import { AddFieldModal } from './AddFieldModal';
import type { FormField } from '../types/workflow';

interface FormConfigurationPanelProps {
  workflowId: string;
}

export function FormConfigurationPanel({
  workflowId,
}: FormConfigurationPanelProps) {
  const {
    data: formData,
    isLoading,
    error,
  } = useWorkflowFormFields(workflowId);
  const saveFieldsMutation = useSaveFormFields();

  const [fields, setFields] = useState<FormField[]>([]);
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [successMessage, setSuccessMessage] = useState(
    "Thank you! We'll be in touch soon."
  );
  const [redirectUrl, setRedirectUrl] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  // Load data from API
  useEffect(() => {
    if (formData) {
      setFields(formData.fields || []);
      setSubmitButtonText(formData.settings?.submitButtonText || 'Submit');
      setSuccessMessage(
        formData.settings?.successMessage ||
          "Thank you! We'll be in touch soon."
      );
      setRedirectUrl(formData.settings?.redirectUrl || '');
      setHasChanges(false);
    }
  }, [formData]);

  // Track changes
  useEffect(() => {
    if (formData) {
      const fieldsChanged =
        JSON.stringify(fields) !== JSON.stringify(formData.fields);
      const settingsChanged =
        submitButtonText !==
          (formData.settings?.submitButtonText || 'Submit') ||
        successMessage !==
          (formData.settings?.successMessage ||
            "Thank you! We'll be in touch soon.") ||
        redirectUrl !== (formData.settings?.redirectUrl || '');

      setHasChanges(fieldsChanged || settingsChanged);
    }
  }, [fields, submitButtonText, successMessage, redirectUrl, formData]);

  const handleSaveChanges = async () => {
    try {
      await saveFieldsMutation.mutateAsync({
        workflowId,
        fields: fields.map((field) => ({
          fieldKey: field.fieldKey,
          label: field.label,
          fieldType: field.fieldType,
          isRequired: field.isRequired,
          placeholder: field.placeholder,
          helpText: field.helpText,
          displayOrder: field.displayOrder,
          validationRules: field.validationRules,
        })),
        settings: {
          submitButtonText,
          successMessage,
          redirectUrl: redirectUrl || undefined,
        },
      });
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save form fields:', err);
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setIsAddFieldModalOpen(true);
  };

  const handleEditField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      setEditingField(field);
      setIsAddFieldModalOpen(true);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
  };

  const handleAddOrUpdateField = (newField: Omit<FormField, 'id'>) => {
    if (editingField) {
      // Update existing field
      setFields(
        fields.map((f) =>
          f.id === editingField.id ? { ...newField, id: editingField.id } : f
        )
      );
    } else {
      // Add new field
      const newFieldWithId: FormField = {
        ...newField,
        id: `temp_${Date.now()}`, // Temporary ID until saved to backend
      };
      setFields([...fields, newFieldWithId]);
    }
    setEditingField(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground text-sm">
            Loading form configuration...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">
            Failed to load form configuration
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AddFieldModal
        open={isAddFieldModalOpen}
        onOpenChange={setIsAddFieldModalOpen}
        onAdd={handleAddOrUpdateField}
        editingField={editingField}
        existingFields={fields}
      />

      <div className="space-y-6">
        {/* Form Fields Section */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-[18px] font-semibold text-neutral-900">
                Form Fields
              </h3>
              <p className="text-[14px] text-neutral-600">
                Configure the fields that will appear in your form
              </p>
            </div>
            <Button onClick={handleAddField}>
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          <div className="space-y-3">
            {fields.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <p>No form fields configured yet</p>
                <Button
                  onClick={handleAddField}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  onEdit={() => handleEditField(field.id)}
                  onDelete={() => handleDeleteField(field.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Form Appearance Section */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="mb-1 text-[18px] font-semibold text-neutral-900">
              Form Appearance
            </h3>
            <p className="text-[14px] text-neutral-600">
              Customize how your form looks and behaves
            </p>
          </div>

          <div className="space-y-5">
            {/* Submit Button Text */}
            <div>
              <Label htmlFor="submitButtonText">Submit Button Text</Label>
              <Input
                id="submitButtonText"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                placeholder="Submit"
                className="mt-1.5"
              />
            </div>

            {/* Success Message */}
            <div>
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="Thank you! We'll be in touch soon."
                rows={3}
                className="mt-1.5"
              />
              <p className="mt-1.5 text-[13px] text-neutral-500">
                Shown after successful form submission
              </p>
            </div>

            {/* Redirect URL */}
            <div>
              <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
              <Input
                id="redirectUrl"
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://example.com/thank-you"
                className="mt-1.5"
              />
              <p className="mt-1.5 text-[13px] text-neutral-500">
                Redirect users to this page after submission
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <Button
              size="lg"
              onClick={handleSaveChanges}
              disabled={!hasChanges || saveFieldsMutation.isPending}
            >
              {saveFieldsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            {hasChanges && (
              <p className="text-muted-foreground mt-2 text-sm">
                You have unsaved changes
              </p>
            )}
            {saveFieldsMutation.isSuccess && !hasChanges && (
              <p className="mt-2 text-sm text-green-600">
                Changes saved successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface FieldCardProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
}

function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition-all duration-150 hover:border-neutral-300 hover:shadow-sm">
      {/* Drag Handle */}
      <button className="cursor-grab p-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-neutral-400" />
      </button>

      {/* Field Info */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[15px] font-medium text-neutral-900">
            {field.label}
          </span>
          {field.isRequired && (
            <span className="text-[12px] font-medium text-red-500">
              Required
            </span>
          )}
        </div>
        <div className="text-[13px] text-neutral-500">
          {field.fieldType}
          {field.placeholder && ` • ${field.placeholder}`}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-2 transition-colors hover:bg-neutral-100"
        >
          <Edit2 className="h-4 w-4 text-neutral-600" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-2 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
