'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '../store/onboardingStore';
import { useFormFieldsMutation } from '../hooks/useFormFieldsMutation';
import { useFormFields } from '../hooks/useFormFields';
import { FieldCard } from '../components/FieldCard';
import { FieldEditorModal } from '../components/FieldEditorModal';
import { LivePreviewPanel } from '../components/LivePreviewPanel';
import type { FormField } from '../types/form-fields';
import type { FormFieldFormData } from '../validations/form-field';
import { toast } from 'sonner';

// Default fields that cannot be edited or deleted
const DEFAULT_FIELDS: FormField[] = [
  {
    id: 'default-name',
    fieldKey: 'name',
    label: 'Name',
    fieldType: 'TEXT',
    placeholder: 'Full name of the lead',
    isRequired: true,
    isDefault: true,
    displayOrder: 0,
  },
  {
    id: 'default-email',
    fieldKey: 'email',
    label: 'Email',
    fieldType: 'EMAIL',
    placeholder: 'Email address',
    isRequired: true,
    isDefault: true,
    displayOrder: 1,
  },
  {
    id: 'default-companyName',
    fieldKey: 'companyName',
    label: 'Company Name',
    fieldType: 'TEXT',
    placeholder: 'Company name',
    isRequired: false,
    isDefault: true,
    displayOrder: 2,
  },
];

// Default field keys that should never be shown in custom fields
const DEFAULT_FIELD_KEYS = ['name', 'email', 'companyName'];

export function FormBuilderScreen() {
  const router = useRouter();
  const {
    formFields,
    workflowId,
    selectedStrategy,
    setFormFields,
    addFormField,
    updateFormField,
    deleteFormField,
  } = useOnboardingStore();
  const { mutate: saveFormFields, isPending } = useFormFieldsMutation();

  // Fetch form fields from database
  const { data: formFieldsResponse, isLoading: isLoadingFormFields } =
    useFormFields(workflowId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load form fields from database and filter out default fields
  useEffect(() => {
    if (formFieldsResponse?.data?.data?.formFields && workflowId) {
      const savedFields = formFieldsResponse.data.data.formFields;

      // Filter out default fields (by fieldKey) and fields marked as isDefault
      const customFieldsOnly = savedFields.filter(
        (field) =>
          !DEFAULT_FIELD_KEYS.includes(field.fieldKey) && !field.isDefault
      );

      // Set only custom fields in the store
      setFormFields(customFieldsOnly);
    } else if (formFields.length === 0 && !isLoadingFormFields) {
      // Only initialize with defaults if no fields exist and we're not loading
      setFormFields([]);
    }
  }, [
    formFieldsResponse,
    workflowId,
    isLoadingFormFields,
    formFields.length,
    setFormFields,
  ]);

  // Check if user has completed step 1
  useEffect(() => {
    if (!selectedStrategy.id || !workflowId) {
      router.push('/onboarding/strategy');
    }
  }, [selectedStrategy.id, workflowId, router]);

  const allFields = [
    ...DEFAULT_FIELDS,
    ...formFields.filter((f) => !f.isDefault),
  ];
  const customFields = formFields.filter((f) => !f.isDefault);
  const existingFieldKeys = allFields.map((f) => f.fieldKey);

  const handleAddField = () => {
    setEditingField(null);
    setIsModalOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this field? This cannot be undone.'
      )
    ) {
      deleteFormField(fieldId);
      toast.success('Field deleted');
    }
  };

  const handleSaveField = (fieldData: FormFieldFormData) => {
    if (!workflowId) {
      toast.error('Workflow ID is missing');
      return;
    }

    const newField: FormField = {
      id: editingField?.id || `field-${Date.now()}`,
      ...fieldData,
      isDefault: false,
    };

    if (editingField) {
      updateFormField(editingField.id, newField);
      toast.success('Field updated');
    } else {
      addFormField({
        ...newField,
        displayOrder: customFields.length,
      });
      toast.success('Field added');
    }

    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleContinue = () => {
    if (!workflowId) {
      toast.error('Workflow ID is missing');
      return;
    }

    // Only save custom fields to the database (default fields are always hardcoded)
    const fieldsToSave = customFields.map((field, index) => ({
      ...field,
      displayOrder: index,
    }));

    saveFormFields({
      workflowId,
      formFields: fieldsToSave,
    });
  };

  const handleBack = () => {
    router.push('/onboarding/strategy');
  };

  return (
    <div className="bg-background flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel: Form Builder */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-28 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-primary mb-4 flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  Build Your Intake Form
                </h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Add custom fields to capture the exact data you need from
                  leads.
                </p>
              </div>
              <div className="text-muted-foreground text-xs font-medium sm:text-sm">
                Step 2 of 5
              </div>
            </div>
          </div>

          {/* Default Fields Section */}
          <div className="mb-8">
            <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
              Default Fields
            </h2>
            <div className="space-y-3">
              {DEFAULT_FIELDS.map((field) => (
                <FieldCard key={field.id} field={field} isDefault />
              ))}
            </div>
          </div>

          {/* Custom Fields Section */}
          <div className="mb-8">
            <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
              Custom Fields
            </h2>
            {customFields.length === 0 ? (
              <div className="border-muted bg-muted/30 rounded-lg border-2 border-dashed p-12 text-center">
                <div className="mb-4 text-5xl opacity-50">📝</div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No custom fields yet
                </h3>
                <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm">
                  Add custom fields to capture specific data from your leads.
                </p>
                <Button onClick={handleAddField} variant="outline" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="relative">
                    <FieldCard
                      field={field}
                      onEdit={() => handleEditField(field)}
                      onDelete={() => handleDeleteField(field.id)}
                      dragHandleProps={{
                        'aria-label': `Drag to reorder ${field.label}`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Field Button */}
          {customFields.length > 0 && (
            <button
              type="button"
              onClick={handleAddField}
              className="border-muted text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-transparent px-4 py-4 text-sm font-medium transition-all active:scale-[0.98]"
            >
              <Plus className="h-5 w-5 transition-transform hover:rotate-90" />
              Add Custom Field
            </button>
          )}
        </div>
      </div>

      {/* Right Panel: Live Preview - Desktop/Laptop */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[45%]">
        <LivePreviewPanel formFields={allFields} />
      </div>

      {/* Preview Accordion - Tablet */}
      <div className="hidden md:block lg:hidden">
        <LivePreviewPanel formFields={allFields} isAccordion />
      </div>

      {/* Mobile Preview Modal Sheet */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsPreviewOpen(false)}
          />
          <div className="fixed right-0 bottom-0 left-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-lg">
            <div className="border-border bg-background sticky top-0 flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-foreground text-lg font-semibold">
                Form Preview
              </h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-muted-foreground hover:bg-muted rounded-md p-2"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <LivePreviewPanel formFields={allFields} isMobileSheet />
            </div>
          </div>
        </div>
      )}

      {/* Floating Preview Button - Mobile */}
      <button
        onClick={() => setIsPreviewOpen(true)}
        className="fixed right-4 bottom-28 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-lg transition-all hover:scale-110 hover:shadow-xl lg:hidden"
        aria-label="Open form preview"
      >
        <Eye className="h-6 w-6 text-white" />
      </button>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10 lg:py-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isPending}
          className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
        >
          {isPending ? (
            'Saving...'
          ) : (
            <>
              Continue to Email Configuration
              <span className="hidden sm:inline"> →</span>
            </>
          )}
        </Button>
      </div>

      {/* Field Editor Modal */}
      <FieldEditorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        field={editingField}
        existingFieldKeys={existingFieldKeys}
        onSave={handleSaveField}
      />
    </div>
  );
}
