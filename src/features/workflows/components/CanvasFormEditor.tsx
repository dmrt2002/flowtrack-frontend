'use client';

import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Plus } from 'lucide-react';
import { FormElementWrapper } from './FormElementWrapper';
import { FormElementSidebar } from './FormElementSidebar';
import { DraggableFormFieldList } from './DraggableFormFieldList';
import { RichTextViewer } from '@/components/RichTextEditor';
import type { FormField, WorkflowFormFields } from '../types/workflow';

interface CanvasFormEditorProps {
  workflowId: string;
  formData: WorkflowFormFields;
  onUpdate: (data: Partial<WorkflowFormFields>) => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type SelectedElementType =
  | 'header'
  | 'description'
  | 'field'
  | 'addField'
  | null;

interface SelectedElement {
  type: SelectedElementType;
  fieldId?: string;
}

export function CanvasFormEditor({
  formData,
  onUpdate,
}: CanvasFormEditorProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({
    type: null,
  });

  const handleElementClick = (type: SelectedElementType, fieldId?: string) => {
    setSelectedElement({ type, fieldId });
  };

  const handleCloseSidebar = () => {
    setSelectedElement({ type: null });
  };

  const handleUpdateHeader = (html: string, json: any) => {
    onUpdate({
      settings: {
        ...formData.settings,
        formHeader: html,
        formHeaderRich: json,
      },
    });
  };

  const handleUpdateDescription = (html: string, json: any) => {
    onUpdate({
      settings: {
        ...formData.settings,
        formDescription: html,
        formDescriptionRich: json,
      },
    });
  };

  const handleToggleHeader = (show: boolean) => {
    onUpdate({
      settings: {
        ...formData.settings,
        showFormHeader: show,
      },
    });
  };

  const handleToggleDescription = (show: boolean) => {
    onUpdate({
      settings: {
        ...formData.settings,
        showFormDescription: show,
      },
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = formData.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onUpdate({ fields: updatedFields });
  };

  const handleReorderFields = (reorderedFields: FormField[]) => {
    onUpdate({ fields: reorderedFields });
  };

  const handleAddField = (newField: Omit<FormField, 'id'>) => {
    const newId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fieldWithId: FormField = {
      ...newField,
      id: newId,
    };
    onUpdate({ fields: [...formData.fields, fieldWithId] });
    setSelectedElement({ type: null });
  };

  const handleDeleteField = (fieldId: string) => {
    onUpdate({ fields: formData.fields.filter((f) => f.id !== fieldId) });
    if (selectedElement.fieldId === fieldId) {
      setSelectedElement({ type: null });
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-neutral-100">
      {/* Main Canvas Area */}
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

        {/* Form Preview */}
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
            {/* Form Header */}
            <div className="mb-8 text-center">
              {formData.settings?.showFormHeader !== false && (
                <FormElementWrapper
                  isSelected={selectedElement.type === 'header'}
                  onClick={() => handleElementClick('header')}
                  label="Header"
                >
                  {formData.settings?.formHeader ? (
                    <div className="mb-2 text-center text-[32px] leading-tight font-bold tracking-tight text-neutral-900">
                      <RichTextViewer
                        html={formData.settings.formHeader}
                        className=""
                      />
                    </div>
                  ) : (
                    <h1 className="mb-2 text-[32px] leading-tight font-bold tracking-tight text-neutral-900">
                      Get in Touch
                    </h1>
                  )}
                </FormElementWrapper>
              )}

              {/* Form Description */}
              {formData.settings?.showFormDescription !== false && (
                <FormElementWrapper
                  isSelected={selectedElement.type === 'description'}
                  onClick={() => handleElementClick('description')}
                  label="Description"
                >
                  {formData.settings?.formDescription ? (
                    <div className="text-center text-[17px] leading-relaxed text-neutral-600">
                      <RichTextViewer
                        html={formData.settings.formDescription}
                        className=""
                      />
                    </div>
                  ) : (
                    <p className="text-[17px] leading-relaxed text-neutral-600">
                      Fill out the form below and we&apos;ll get back to you
                      within 24 hours
                    </p>
                  )}
                </FormElementWrapper>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <DraggableFormFieldList
                fields={formData.fields}
                selectedFieldId={
                  selectedElement.type === 'field'
                    ? selectedElement.fieldId
                    : undefined
                }
                onFieldClick={(fieldId) => handleElementClick('field', fieldId)}
                onReorder={handleReorderFields}
                onDelete={handleDeleteField}
              />
            </div>

            {/* Add Field Button */}
            <button
              onClick={() => handleElementClick('addField')}
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
                {formData.settings?.submitButtonText || 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <FormElementSidebar
        isOpen={selectedElement.type !== null}
        onClose={handleCloseSidebar}
        elementType={selectedElement.type}
        formData={formData}
        selectedFieldId={selectedElement.fieldId}
        onUpdateHeader={handleUpdateHeader}
        onUpdateDescription={handleUpdateDescription}
        onToggleHeader={handleToggleHeader}
        onToggleDescription={handleToggleDescription}
        onUpdateField={handleUpdateField}
        onAddField={handleAddField}
      />
    </div>
  );
}
