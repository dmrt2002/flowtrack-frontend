/**
 * Template Editor Dialog
 *
 * Modal for creating/editing custom templates
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, X, AlertCircle, Info } from 'lucide-react';
import {
  useCreateTemplate,
  useUpdateTemplate,
  useValidateTemplate,
} from '../../hooks/use-pitch-config';
import {
  PitchTemplate,
  PitchTone,
  PitchLength,
  PitchFocus,
  TONE_LABELS,
  LENGTH_LABELS,
  FOCUS_LABELS,
} from '../../types/pitch-config';

interface TemplateEditorDialogProps {
  open: boolean;
  onClose: () => void;
  template?: PitchTemplate | null;
}

export function TemplateEditorDialog({
  open,
  onClose,
  template,
}: TemplateEditorDialogProps) {
  const isEditing = !!template;

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const validateMutation = useValidateTemplate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [tone, setTone] = useState<PitchTone>(PitchTone.PROFESSIONAL);
  const [length, setLength] = useState<PitchLength>(PitchLength.MEDIUM);
  const [focusAreas, setFocusAreas] = useState<PitchFocus[]>([]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showVariablesHelp, setShowVariablesHelp] = useState(false);

  // Load template data when editing
  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setPromptTemplate(template.promptTemplate);
      setTone(template.quickSettings.tone);
      setLength(template.quickSettings.length);
      setFocusAreas(template.quickSettings.focusAreas);
    } else {
      // Reset for new template
      setName('');
      setDescription('');
      setPromptTemplate('');
      setTone(PitchTone.PROFESSIONAL);
      setLength(PitchLength.MEDIUM);
      setFocusAreas([]);
    }
    setValidationError(null);
  }, [template, open]);

  const handleFocusToggle = (focus: PitchFocus) => {
    setFocusAreas((prev) =>
      prev.includes(focus) ? prev.filter((f) => f !== focus) : [...prev, focus]
    );
  };

  const handleValidate = async () => {
    if (!promptTemplate.trim()) {
      setValidationError('Template cannot be empty');
      return;
    }

    try {
      const result = await validateMutation.mutateAsync(promptTemplate);
      if (result.valid) {
        setValidationError(null);
      } else {
        setValidationError(result.error || 'Invalid template syntax');
      }
    } catch {
      setValidationError('Failed to validate template');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !promptTemplate.trim()) {
      setValidationError('All fields are required');
      return;
    }

    // Validate template before saving
    try {
      const result = await validateMutation.mutateAsync(promptTemplate);
      if (!result.valid) {
        setValidationError(result.error || 'Invalid template syntax');
        return;
      }
    } catch {
      setValidationError('Failed to validate template');
      return;
    }

    const templateData = {
      name,
      description,
      promptTemplate,
      category: 'custom' as const,
      isDefault: false,
      quickSettings: {
        tone,
        length,
        focusAreas,
      },
    };

    try {
      if (isEditing && template) {
        await updateMutation.mutateAsync({
          templateId: template.id,
          updates: templateData,
        });
      } else {
        await createMutation.mutateAsync(templateData);
      }
      onClose();
    } catch {
      setValidationError('Failed to save template');
    }
  };

  if (!open) return null;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {isEditing ? 'Edit Template' : 'Create Custom Template'}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Design a custom prompt template with Handlebars syntax
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-neutral-100"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Enterprise Sales Pitch"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of when to use this template"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Prompt Template */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700">
                Prompt Template
              </label>
              <button
                onClick={() => setShowVariablesHelp(!showVariablesHelp)}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
              >
                <Info className="h-3 w-3" />
                {showVariablesHelp ? 'Hide' : 'Show'} Available Variables
              </button>
            </div>

            {showVariablesHelp && (
              <div className="mb-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                <p className="mb-2 font-semibold">Available Variables:</p>
                <div className="grid grid-cols-2 gap-2">
                  <code>{'{{userCompanyName}}'}</code>
                  <code>{'{{userCompanyIndustry}}'}</code>
                  <code>{'{{leadCompanyName}}'}</code>
                  <code>{'{{leadIndustry}}'}</code>
                  <code>{'{{leadTechStack}}'}</code>
                  <code>{'{{leadEmployeeCount}}'}</code>
                  <code>{'{{leadFoundedYear}}'}</code>
                  <code>{'{{leadDescription}}'}</code>
                </div>
                <p className="mt-2">
                  <strong>Helpers:</strong> {'{{join array ", "}}'},{' '}
                  {'{{#ifEquals a b}}...{{/ifEquals}}'}, {'{{upper string}}'},{' '}
                  {'{{lower string}}'}
                </p>
              </div>
            )}

            <textarea
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="Write your custom prompt template using Handlebars syntax..."
              rows={10}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="mt-2 flex items-center justify-between">
              <Button
                onClick={handleValidate}
                variant="outline"
                size="sm"
                disabled={validateMutation.isPending || !promptTemplate.trim()}
              >
                {validateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate Template'
                )}
              </Button>

              {validationError && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="rounded-lg border border-neutral-200 p-4">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">
              Default Quick Settings
            </h4>

            {/* Tone */}
            <div className="mb-3">
              <label className="mb-2 block text-xs font-medium text-neutral-700">
                Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(PitchTone).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      tone === t
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {TONE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="mb-3">
              <label className="mb-2 block text-xs font-medium text-neutral-700">
                Length
              </label>
              <div className="flex gap-2">
                {Object.values(PitchLength).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      length === l
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {LENGTH_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="mb-2 block text-xs font-medium text-neutral-700">
                Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(PitchFocus).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFocusToggle(f)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      focusAreas.includes(f)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {FOCUS_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button onClick={onClose} variant="outline" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Update Template'
            ) : (
              'Create Template'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
