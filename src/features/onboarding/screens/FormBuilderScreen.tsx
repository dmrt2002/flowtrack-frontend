'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '../store/onboardingStore';
import { useFormFieldsMutation } from '../hooks/useFormFieldsMutation';
import { useFormFields } from '../hooks/useFormFields';
import { useInitWorkflow } from '../hooks/useInitWorkflow';
import { FieldEditorModal } from '../components/FieldEditorModal';
import { DraggableFormFieldList } from '../components/DraggableFormFieldList';
import { FormElementWrapper } from '../components/FormElementWrapper';
import { FormElementSidebar } from '../components/FormElementSidebar';
import { RichTextViewer } from '@/components/RichTextEditor';
import type { FormField, FormFieldPayload } from '../types/form-fields';
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
  const {
    formFields,
    workflowId,
    formHeader,
    formHeaderRich,
    formDescription,
    formDescriptionRich,
    setFormFields,
    addFormField,
    updateFormField,
    deleteFormField,
    setFormHeader,
    setFormDescription,
  } = useOnboardingStore();
  const { mutate: saveFormFields, isPending } = useFormFieldsMutation();

  // Initialize workflow if not already initialized
  const {
    isLoading: isInitializing,
    isError: isInitError,
    error: initError,
    isFetching: isFetchingInit,
    data: initData,
  } = useInitWorkflow();

  // Fetch form fields from database
  const { data: formFieldsResponse, isLoading: isLoadingFormFields } =
    useFormFields(workflowId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<
    'header' | 'description' | 'field' | null
  >(null);
  const hasInitialLoadRef = useRef(false);
  const lastWorkflowIdRef = useRef<string | null>(null);

  // Load form fields from database and filter out default fields
  // Only load on initial mount or when workflowId changes, not when formFields changes locally
  useEffect(() => {
    // Reset initial load flag if workflowId changes
    if (lastWorkflowIdRef.current !== workflowId) {
      hasInitialLoadRef.current = false;
      lastWorkflowIdRef.current = workflowId;
    }

    // Only load from API on initial load or when workflowId changes
    if (
      formFieldsResponse?.data?.data?.formFields &&
      workflowId &&
      !hasInitialLoadRef.current
    ) {
      const savedFields = formFieldsResponse.data.data.formFields;

      // Filter out default fields (by fieldKey) and fields marked as isDefault
      const customFieldsOnly = savedFields.filter(
        (field) =>
          !DEFAULT_FIELD_KEYS.includes(field.fieldKey) && !field.isDefault
      );

      // Set only custom fields in the store
      setFormFields(customFieldsOnly);
      hasInitialLoadRef.current = true;
    } else if (
      !hasInitialLoadRef.current &&
      !isLoadingFormFields &&
      workflowId &&
      !formFieldsResponse?.data?.data?.formFields
    ) {
      // Only initialize with empty array if no API data exists and we're not loading
      // This handles the case where API returns no fields or hasn't loaded yet
      setFormFields([]);
      hasInitialLoadRef.current = true;
    }
  }, [formFieldsResponse, workflowId, isLoadingFormFields, setFormFields]);

  // Show loading state while initializing workflow
  // Only show loading if we're actually fetching and don't have a workflowId yet
  if ((isInitializing || isFetchingInit) && !workflowId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground">Initializing workflow...</p>
          {initData && (
            <p className="text-muted-foreground mt-2 text-xs">
              Data received, setting up...
            </p>
          )}
        </div>
      </div>
    );
  }

  // If we have init data but workflowId is still not set, wait a bit for useEffect to update
  if (initData?.success && initData.data && !workflowId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground">Setting up workflow...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (isInitError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to initialize workflow</p>
          <p className="text-muted-foreground text-sm">
            {(initError as any)?.response?.data?.message ||
              'Please try refreshing the page'}
          </p>
        </div>
      </div>
    );
  }

  // Use default fields (budget is no longer a default field)
  const defaultFieldsWithStrategy = DEFAULT_FIELDS;

  const allFields = [
    ...defaultFieldsWithStrategy,
    ...formFields.filter((f) => !f.isDefault),
  ];
  const customFields = formFields.filter((f) => !f.isDefault);
  const existingFieldKeys = allFields.map((f) => f.fieldKey);

  const handleAddField = () => {
    // Close sidebar if open
    setSelectedElement(null);
    setSelectedFieldId(null);
    // Clear editing field and open modal for adding new field
    setEditingField(null);
    setIsModalOpen(true);
  };

  const handleFieldClick = (fieldId: string) => {
    const field = allFields.find((f) => f.id === fieldId);
    if (field && !field.isDefault) {
      // Close modal first
      setIsModalOpen(false);
      // Set field selection
      setSelectedFieldId(fieldId);
      setEditingField(field);
      // Open sidebar for field editing
      setSelectedElement('field');
    }
  };

  const handleHeaderClick = () => {
    setSelectedElement('header');
    setSelectedFieldId(null);
  };

  const handleDescriptionClick = () => {
    setSelectedElement('description');
    setSelectedFieldId(null);
  };

  const handleCloseSidebar = () => {
    setSelectedElement(null);
    setSelectedFieldId(null);
    setEditingField(null);
  };

  const handleUpdateHeader = (html: string, json: any) => {
    setFormHeader(html || null, json);
  };

  const handleUpdateDescription = (html: string, json: any) => {
    setFormDescription(html || null, json);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    updateFormField(fieldId, updates);
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

    // This should only be called when adding a NEW field (not editing)
    // Editing is handled by the sidebar's handleUpdateField
    const newField: FormField = {
      id: `field-${Date.now()}`,
      ...fieldData,
      isDefault: false,
    };

    addFormField({
      ...newField,
      displayOrder: customFields.length,
    });
    toast.success('Field added');

    setIsModalOpen(false);
    setEditingField(null);
    setSelectedFieldId(null);
    setSelectedElement(null);
  };

  const handleReorderFields = (reorderedFields: FormField[]) => {
    // Filter out default fields (they shouldn't be reordered)
    const customFieldsOnly = reorderedFields.filter((f) => !f.isDefault);

    // Update displayOrder for custom fields only
    const updatedCustomFields = customFieldsOnly.map((field, index) => ({
      ...field,
      displayOrder: defaultFieldsWithStrategy.length + index,
    }));

    // Update custom fields in store
    setFormFields(updatedCustomFields);
  };

  const handleContinue = () => {
    if (!workflowId) {
      toast.error('Workflow ID is missing');
      return;
    }

    // Save ALL fields (default + custom) to the database
    // Backend deletes existing fields and recreates them, so we need to send everything
    // Note: Backend expects fields without id for creation, so we omit it
    const allFieldsToSave: FormFieldPayload[] = [
      ...defaultFieldsWithStrategy.map((field, index) => ({
        fieldKey: field.fieldKey,
        label: field.label,
        fieldType: field.fieldType,
        placeholder: field.placeholder,
        isRequired: field.isRequired,
        displayOrder: index,
      })),
      ...customFields.map((field, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...fieldWithoutId } = field;
        return {
          ...fieldWithoutId,
          displayOrder: defaultFieldsWithStrategy.length + index,
        };
      }),
    ];

    saveFormFields({
      workflowId,
      formFields: allFieldsToSave,
      settings: {
        formHeader: formHeader || null,
        formHeaderRich: formHeaderRich || null,
        formDescription: formDescription || null,
        formDescriptionRich: formDescriptionRich || null,
        showFormHeader: true,
        showFormDescription: true,
      },
    });
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-border bg-background sticky top-0 z-20 border-b px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Build Your Intake Form
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Add custom fields to capture the exact data you need from leads.
            </p>
          </div>
          <div className="text-muted-foreground text-xs font-medium sm:text-sm">
            Step 1 of 4
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex flex-1 overflow-hidden bg-neutral-100">
        {/* Main Canvas Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Device Preview Toggle */}
          <div className="flex items-center justify-center gap-2 border-b border-neutral-200 bg-white px-4 py-3">
            <button
              onClick={() => setDevice('desktop')}
              className={`rounded-lg p-2 transition-colors ${
                device === 'desktop'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title="Desktop view"
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`rounded-lg p-2 transition-colors ${
                device === 'tablet'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title="Tablet view"
            >
              <Tablet size={20} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`rounded-lg p-2 transition-colors ${
                device === 'mobile'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title="Mobile view"
            >
              <Smartphone size={20} />
            </button>
          </div>

          {/* Form Preview Canvas */}
          <div className="flex flex-1 items-start justify-center overflow-auto px-8 py-12">
            <div
              className="rounded-2xl border-t-4 border-indigo-600 bg-white p-8 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_25px_rgba(0,0,0,0.05),0_20px_40px_rgba(79,70,229,0.08)] transition-all duration-300 md:p-12"
              style={{
                width:
                  device === 'desktop'
                    ? '580px'
                    : device === 'tablet'
                      ? '600px'
                      : '375px',
                maxWidth: '100%',
              }}
            >
              {/* Form Title */}
              <div className="mb-8 text-center">
                <FormElementWrapper
                  isSelected={selectedElement === 'header'}
                  onClick={handleHeaderClick}
                  label="Header"
                >
                  {formHeader ? (
                    <div className="mb-2 text-center text-[32px] leading-tight font-bold tracking-tight text-neutral-900">
                      <RichTextViewer html={formHeader} />
                    </div>
                  ) : (
                    <h1 className="mb-2 text-[32px] leading-tight font-bold tracking-tight text-neutral-900">
                      Book now
                    </h1>
                  )}
                </FormElementWrapper>
                <FormElementWrapper
                  isSelected={selectedElement === 'description'}
                  onClick={handleDescriptionClick}
                  label="Description"
                >
                  {formDescription ? (
                    <div className="text-[17px] leading-relaxed text-neutral-600">
                      <RichTextViewer html={formDescription} />
                    </div>
                  ) : (
                    <p className="text-[17px] leading-relaxed text-neutral-600">
                      We&apos;d love to hear from you! Please fill out the form
                      and we&apos;ll get back to you.
                    </p>
                  )}
                </FormElementWrapper>
              </div>

              {/* Form Fields - Draggable */}
              <div className="space-y-6">
                <DraggableFormFieldList
                  fields={allFields}
                  selectedFieldId={selectedFieldId || undefined}
                  onFieldClick={handleFieldClick}
                  onReorder={handleReorderFields}
                  onDelete={handleDeleteField}
                />
              </div>

              {/* Add Field Button */}
              <button
                onClick={handleAddField}
                className="mt-6 mb-6 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-3 font-medium text-neutral-600 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600"
              >
                <Plus size={18} />
                Add Field
              </button>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="button"
                  disabled
                  className="h-[52px] w-full rounded-[10px] bg-gradient-to-br from-indigo-600 to-indigo-700 px-8 text-[16px] font-semibold text-white shadow-[0_2px_4px_rgba(79,70,229,0.15),0_4px_12px_rgba(79,70,229,0.1)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:py-4 lg:px-10 lg:py-6">
        {/* Back button removed - form builder is the first step */}
        <Button
          onClick={handleContinue}
          disabled={isPending}
          className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
        >
          {isPending ? (
            'Saving...'
          ) : (
            <>
              Continue to Integrations
              <span className="hidden sm:inline"> →</span>
            </>
          )}
        </Button>
      </div>

      {/* Field Editor Modal - Only for adding NEW fields */}
      <FieldEditorModal
        open={isModalOpen && !editingField}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingField(null);
          }
        }}
        field={null}
        existingFieldKeys={existingFieldKeys}
        onSave={handleSaveField}
      />

      {/* Header/Description/Field Editor Sidebar */}
      <FormElementSidebar
        isOpen={selectedElement !== null}
        onClose={handleCloseSidebar}
        elementType={selectedElement}
        formHeader={formHeader}
        formDescription={formDescription}
        selectedField={editingField}
        onUpdateHeader={handleUpdateHeader}
        onUpdateDescription={handleUpdateDescription}
        onUpdateField={handleUpdateField}
      />
    </div>
  );
}
