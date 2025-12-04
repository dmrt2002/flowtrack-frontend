/**
 * Templates Tab
 *
 * Template library with built-in and custom templates
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Check } from 'lucide-react';
import {
  usePitchConfig,
  usePitchTemplates,
  useSelectTemplate,
  useDeleteTemplate,
} from '../../hooks/use-pitch-config';
import {
  PitchTemplate,
  TONE_LABELS,
  LENGTH_LABELS,
  FOCUS_LABELS,
} from '../../types/pitch-config';
import { TemplateEditorDialog } from './TemplateEditorDialog';

export function TemplatesTab() {
  const { data: config, isLoading: configLoading } = usePitchConfig();
  const { data: templates, isLoading: templatesLoading } = usePitchTemplates();
  const selectMutation = useSelectTemplate();
  const deleteMutation = useDeleteTemplate();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PitchTemplate | null>(
    null
  );

  const isLoading = configLoading || templatesLoading;

  const handleSelectTemplate = async (templateId: string) => {
    await selectMutation.mutateAsync(templateId);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const handleEditTemplate = (template: PitchTemplate) => {
    setEditingTemplate(template);
    setEditorOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this template? This action cannot be undone.'
      )
    ) {
      return;
    }
    await deleteMutation.mutateAsync(templateId);
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setEditingTemplate(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!config || !templates) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">Failed to load templates</p>
      </div>
    );
  }

  const builtInTemplates = templates.filter((t) => t.category !== 'custom');
  const customTemplates = templates.filter((t) => t.category === 'custom');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Template Library
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Choose from pre-built templates or create your own custom prompts
          </p>
        </div>
        <Button
          onClick={handleCreateTemplate}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Template
        </Button>
      </div>

      {/* Built-in Templates */}
      <div>
        <h4 className="mb-4 text-sm font-semibold text-neutral-900">
          Built-in Templates
        </h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {builtInTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={config.selectedTemplateId === template.id}
              onSelect={() => handleSelectTemplate(template.id)}
              isSelecting={
                selectMutation.isPending &&
                selectMutation.variables === template.id
              }
            />
          ))}
        </div>
      </div>

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div>
          <h4 className="mb-4 text-sm font-semibold text-neutral-900">
            Custom Templates
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={config.selectedTemplateId === template.id}
                onSelect={() => handleSelectTemplate(template.id)}
                onEdit={() => handleEditTemplate(template)}
                onDelete={() => handleDeleteTemplate(template.id)}
                isSelecting={
                  selectMutation.isPending &&
                  selectMutation.variables === template.id
                }
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === template.id
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Template Editor Dialog */}
      <TemplateEditorDialog
        open={editorOpen}
        onClose={handleEditorClose}
        template={editingTemplate}
      />
    </div>
  );
}

interface TemplateCardProps {
  template: PitchTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelecting?: boolean;
  isDeleting?: boolean;
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isSelecting,
  isDeleting,
}: TemplateCardProps) {
  const isCustom = template.category === 'custom';

  return (
    <div
      className={`relative rounded-lg border-2 bg-white p-6 transition-all ${
        isSelected
          ? 'border-indigo-600 shadow-md'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Category Badge */}
      <div className="mb-3">
        <span
          className={`inline-block rounded px-2 py-1 text-xs font-medium ${
            isCustom
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {template.category === 'default'
            ? 'Default'
            : template.category === 'industry'
              ? 'Industry'
              : template.category === 'role'
                ? 'Role'
                : 'Custom'}
        </span>
      </div>

      {/* Template Info */}
      <h5 className="mb-2 text-base font-semibold text-neutral-900">
        {template.name}
      </h5>
      <p className="mb-4 text-sm text-neutral-600">{template.description}</p>

      {/* Quick Settings Preview */}
      <div className="mb-4 space-y-2 rounded-lg bg-neutral-50 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Tone:</span>
          <span className="font-medium text-neutral-700">
            {TONE_LABELS[template.quickSettings.tone]}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Length:</span>
          <span className="font-medium text-neutral-700">
            {LENGTH_LABELS[template.quickSettings.length]}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-neutral-500">Focus:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {template.quickSettings.focusAreas.map((focus) => (
              <span
                key={focus}
                className="rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700"
              >
                {FOCUS_LABELS[focus]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onSelect}
          disabled={isSelecting || isDeleting}
          className={`flex-1 ${
            isSelected
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
          variant={isSelected ? 'default' : 'outline'}
        >
          {isSelecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Selecting...
            </>
          ) : isSelected ? (
            'Selected'
          ) : (
            'Use Template'
          )}
        </Button>

        {isCustom && onEdit && (
          <Button
            onClick={onEdit}
            disabled={isDeleting}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {isCustom && onDelete && (
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            variant="outline"
            size="icon"
            className="flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
