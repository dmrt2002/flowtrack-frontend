'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  Check,
  Workflow,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { WorkflowAnalyticsDashboard } from '../components/WorkflowAnalyticsDashboard';
import { CanvasFormEditor } from '../components/CanvasFormEditor';
import { WorkflowCanvasEditor } from '../components/canvas/WorkflowCanvasEditor';
import type { WorkflowConfiguration } from '../components/canvas/WorkflowCanvasEditor';
import {
  useWorkflowFormFields,
  useSaveFormFields,
} from '../hooks/use-workflow-form-fields';
import {
  useWorkflowConfiguration,
  useSaveWorkflowConfiguration,
} from '../hooks/use-workflow-configuration';
import type { WorkflowFormFields } from '../types/workflow';

interface WorkflowBuilderScreenProps {
  workflowId: string;
}

type TabType = 'workflow' | 'form' | 'analytics';

export function WorkflowBuilderScreen({
  workflowId,
}: WorkflowBuilderScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('workflow');

  const { data: formData } = useWorkflowFormFields(workflowId);
  const { data: configData } = useWorkflowConfiguration(workflowId);
  const saveFieldsMutation = useSaveFormFields();
  const saveConfigMutation = useSaveWorkflowConfiguration();

  // Local state for form editor
  const [canvasFormData, setCanvasFormData] =
    useState<WorkflowFormFields | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for workflow configuration (email templates, delays)
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfiguration>({
    welcomeSubject: "Welcome! Here's your booking link",
    welcomeBody:
      'Hi {firstName},\n\nThanks for your interest! Click here to book a meeting: {bookingUrl}',
    thankYouSubject: 'Thanks for booking!',
    thankYouBody:
      'Hi {firstName},\n\nThanks for booking a meeting with us. We look forward to speaking with you!',
    followUpSubject: 'Still interested?',
    followUpBody:
      "Hi {firstName},\n\nWe noticed you haven't booked a meeting yet. Here's your link again: {bookingUrl}",
    followUpDelayDays: 2,
    deadlineDays: 7,
  });

  // Update canvas data when form data loads
  useEffect(() => {
    if (formData && !canvasFormData) {
      setCanvasFormData(formData);
    }
  }, [formData, canvasFormData]);

  // Update workflow config when API data loads
  useEffect(() => {
    if (configData) {
      setWorkflowConfig({
        welcomeSubject:
          configData.welcomeSubject || "Welcome! Here's your booking link",
        welcomeBody:
          configData.welcomeBody ||
          'Hi {firstName},\n\nThanks for your interest! Click here to book a meeting: {bookingUrl}',
        thankYouSubject: configData.thankYouSubject || 'Thanks for booking!',
        thankYouBody:
          configData.thankYouBody ||
          'Hi {firstName},\n\nThanks for booking a meeting with us. We look forward to speaking with you!',
        followUpSubject: configData.followUpSubject || 'Still interested?',
        followUpBody:
          configData.followUpBody ||
          "Hi {firstName},\n\nWe noticed you haven't booked a meeting yet. Here's your link again: {bookingUrl}",
        followUpDelayDays: configData.followUpDelayDays || 2,
        deadlineDays: configData.deadlineDays || 7,
      });
    }
  }, [configData]);

  // Get workflow status from the form data response
  const workflowStatus = formData?.workflowStatus || 'draft';
  const workflowName = formData?.workflowName || 'Contact Form Workflow';
  const isActive = workflowStatus === 'active';

  const tabs = [
    { id: 'workflow' as TabType, label: 'Canvas', icon: Workflow },
    { id: 'form' as TabType, label: 'Form', icon: FileText },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  ];

  // Auto-save function with debouncing
  const autoSave = async (data: WorkflowFormFields) => {
    try {
      setIsSaving(true);
      await saveFieldsMutation.mutateAsync({
        workflowId,
        formFields: data.fields.map((field) => ({
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
          formHeader: data.settings?.formHeader,
          formHeaderRich: data.settings?.formHeaderRich,
          showFormHeader: data.settings?.showFormHeader ?? true,
          formDescription: data.settings?.formDescription,
          formDescriptionRich: data.settings?.formDescriptionRich,
          showFormDescription: data.settings?.showFormDescription ?? true,
          submitButtonText: data.settings?.submitButtonText,
          successMessage: data.settings?.successMessage,
          redirectUrl: data.settings?.redirectUrl,
        },
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to auto-save changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCanvasUpdate = (updates: Partial<WorkflowFormFields>) => {
    if (canvasFormData) {
      const updatedData = { ...canvasFormData, ...updates };
      setCanvasFormData(updatedData);

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout for auto-save (debounce by 1 second)
      saveTimeoutRef.current = setTimeout(() => {
        autoSave(updatedData);
      }, 1000);
    }
  };

  const handleWorkflowConfigUpdate = async (
    updates: Partial<WorkflowConfiguration>
  ) => {
    const updatedConfig = { ...workflowConfig, ...updates };
    setWorkflowConfig(updatedConfig);

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a new timeout for auto-save (debounce by 1 second)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveConfigMutation.mutateAsync({
          workflowId,
          welcomeSubject: updatedConfig.welcomeSubject,
          welcomeBody: updatedConfig.welcomeBody,
          thankYouSubject: updatedConfig.thankYouSubject,
          thankYouBody: updatedConfig.thankYouBody,
          followUpSubject: updatedConfig.followUpSubject,
          followUpBody: updatedConfig.followUpBody,
          followUpDelayDays: updatedConfig.followUpDelayDays,
          deadlineDays: updatedConfig.deadlineDays,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save workflow configuration:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => router.push('/workflows')}
                className="-ml-1.5 rounded-lg p-1.5 transition-colors hover:bg-neutral-100"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-600" />
              </button>
              <h1 className="text-[32px] font-bold tracking-tight text-neutral-900">
                {workflowName}
              </h1>
            </div>
            <p className="flex items-center gap-3 text-[15px] text-neutral-600">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-green-500' : 'bg-neutral-400'
                  }`}
                />
                {isActive ? 'Active' : 'Draft'}
              </span>
              {(activeTab === 'workflow' || activeTab === 'form') && (
                <>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      <span className="text-indigo-600">Saving...</span>
                    </>
                  ) : lastSaved ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Saved</span>
                    </>
                  ) : null}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="-mb-px flex gap-1 border-b border-neutral-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'workflow' && (
            <WorkflowCanvasEditor
              workflowId={workflowId}
              configurationData={workflowConfig}
              onUpdate={handleWorkflowConfigUpdate}
            />
          )}

          {activeTab === 'form' && canvasFormData && (
            <CanvasFormEditor
              workflowId={workflowId}
              formData={canvasFormData}
              onUpdate={handleCanvasUpdate}
            />
          )}

          {activeTab === 'analytics' && (
            <WorkflowAnalyticsDashboard workflowId={workflowId} />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
