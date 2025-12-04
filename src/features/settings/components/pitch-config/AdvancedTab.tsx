/**
 * Advanced Tab
 *
 * Advanced configuration for custom prompts and model parameters
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Info, RotateCcw } from 'lucide-react';
import {
  usePitchConfig,
  useUpdateAdvancedConfig,
  useValidateTemplate,
} from '../../hooks/use-pitch-config';
import { PitchAdvancedConfig } from '../../types/pitch-config';

export function AdvancedTab() {
  const { data: config, isLoading } = usePitchConfig();
  const updateMutation = useUpdateAdvancedConfig();
  const validateMutation = useValidateTemplate();

  const [localConfig, setLocalConfig] = useState<PitchAdvancedConfig | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showVariablesHelp, setShowVariablesHelp] = useState(false);

  // Use local config if available, otherwise use server config
  const currentConfig = localConfig || config?.advancedConfig;

  useEffect(() => {
    if (config && !localConfig) {
      setLocalConfig(config.advancedConfig);
    }
  }, [config, localConfig]);

  const handleToggleCustomPrompt = (enabled: boolean) => {
    setLocalConfig({
      ...currentConfig!,
      useCustomPrompt: enabled,
    });
  };

  const handleCustomPromptChange = (template: string) => {
    setLocalConfig({
      ...currentConfig!,
      customPromptTemplate: template,
    });
    setValidationError(null);
  };

  const handleSystemInstructionsChange = (instructions: string) => {
    setLocalConfig({
      ...currentConfig!,
      systemInstructions: instructions,
    });
  };

  const handleTemperatureChange = (temperature: number) => {
    setLocalConfig({
      ...currentConfig!,
      temperature,
    });
  };

  const handleMaxTokensChange = (maxTokens: number) => {
    setLocalConfig({
      ...currentConfig!,
      maxTokens,
    });
  };

  const handleValidate = async () => {
    if (!currentConfig?.customPromptTemplate?.trim()) {
      setValidationError('Template cannot be empty');
      return;
    }

    try {
      const result = await validateMutation.mutateAsync(
        currentConfig.customPromptTemplate
      );
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
    if (!localConfig) return;

    // If custom prompt is enabled, validate it first
    if (localConfig.useCustomPrompt) {
      if (!localConfig.customPromptTemplate?.trim()) {
        setValidationError('Custom prompt template cannot be empty');
        return;
      }

      try {
        const result = await validateMutation.mutateAsync(
          localConfig.customPromptTemplate
        );
        if (!result.valid) {
          setValidationError(result.error || 'Invalid template syntax');
          return;
        }
      } catch {
        setValidationError('Failed to validate template');
        return;
      }
    }

    await updateMutation.mutateAsync(localConfig);
    setLocalConfig(null);
  };

  const handleReset = () => {
    setLocalConfig(null);
    setValidationError(null);
  };

  const hasChanges = localConfig !== null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!currentConfig) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">Failed to load configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">
          Advanced Configuration
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Fine-tune the AI model behavior with custom prompts and parameters
        </p>
      </div>

      {/* Custom Prompt Toggle */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-neutral-900">
              Use Custom Prompt Template
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              Override the template system and use your own custom Handlebars
              prompt
            </p>
          </div>
          <button
            onClick={() =>
              handleToggleCustomPrompt(!currentConfig.useCustomPrompt)
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
              currentConfig.useCustomPrompt ? 'bg-indigo-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                currentConfig.useCustomPrompt
                  ? 'translate-x-5'
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {currentConfig.useCustomPrompt && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700">
                Custom Prompt Template
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
              value={currentConfig.customPromptTemplate || ''}
              onChange={(e) => handleCustomPromptChange(e.target.value)}
              placeholder="Write your custom prompt template using Handlebars syntax..."
              rows={12}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="mt-2 flex items-center justify-between">
              <Button
                onClick={handleValidate}
                variant="outline"
                size="sm"
                disabled={
                  validateMutation.isPending ||
                  !currentConfig.customPromptTemplate?.trim()
                }
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
        )}
      </div>

      {/* System Instructions */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-1 text-sm font-semibold text-neutral-900">
          System Instructions
        </h4>
        <p className="mb-4 text-xs text-neutral-500">
          Additional instructions to guide the AI&apos;s behavior (optional)
        </p>

        <textarea
          value={currentConfig.systemInstructions || ''}
          onChange={(e) => handleSystemInstructionsChange(e.target.value)}
          placeholder="e.g., Always mention sustainability initiatives, avoid technical jargon..."
          rows={4}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Model Parameters */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-neutral-900">
          Model Parameters
        </h4>

        {/* Temperature */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">
              Temperature
            </label>
            <span className="font-mono text-sm text-neutral-600">
              {currentConfig.temperature?.toFixed(2) || '0.70'}
            </span>
          </div>
          <p className="mb-3 text-xs text-neutral-500">
            Controls randomness. Lower = more focused, Higher = more creative
            (0.0 - 1.0)
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentConfig.temperature || 0.7}
            onChange={(e) =>
              handleTemperatureChange(parseFloat(e.target.value))
            }
            className="w-full accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>Focused (0.0)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">
              Max Tokens
            </label>
            <span className="font-mono text-sm text-neutral-600">
              {currentConfig.maxTokens || 2000}
            </span>
          </div>
          <p className="mb-3 text-xs text-neutral-500">
            Maximum length of generated pitches (500 - 4000 tokens)
          </p>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={currentConfig.maxTokens || 2000}
            onChange={(e) => handleMaxTokensChange(parseInt(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>Short (500)</span>
            <span>Long (4000)</span>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <h5 className="text-sm font-semibold text-amber-900">
              Advanced Settings
            </h5>
            <p className="mt-1 text-xs text-amber-700">
              These settings give you full control over pitch generation.
              Incorrect configurations may result in poor quality pitches. Test
              thoroughly before applying to all leads.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <p className="mr-auto text-sm text-indigo-700">
            You have unsaved changes
          </p>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={updateMutation.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
