/**
 * Quick Settings Tab
 *
 * Simple UI for tone, length, and focus area customization
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import {
  usePitchConfig,
  useUpdateQuickSettings,
} from '../../hooks/use-pitch-config';
import {
  PitchTone,
  PitchLength,
  PitchFocus,
  TONE_LABELS,
  LENGTH_LABELS,
  FOCUS_LABELS,
  FOCUS_DESCRIPTIONS,
  type PitchQuickSettings,
} from '../../types/pitch-config';

export function QuickSettingsTab() {
  const { data: config, isLoading } = usePitchConfig();
  const updateMutation = useUpdateQuickSettings();

  const [localSettings, setLocalSettings] = useState<PitchQuickSettings | null>(
    null
  );

  // Use local settings if available, otherwise use config
  const currentSettings = localSettings || config?.quickSettings;

  const handleToneChange = (tone: PitchTone) => {
    const newSettings = { ...currentSettings!, tone };
    setLocalSettings(newSettings);
  };

  const handleLengthChange = (length: PitchLength) => {
    const newSettings = { ...currentSettings!, length };
    setLocalSettings(newSettings);
  };

  const handleFocusToggle = (focus: PitchFocus) => {
    const currentFocusAreas = currentSettings?.focusAreas || [];
    const newFocusAreas = currentFocusAreas.includes(focus)
      ? currentFocusAreas.filter((f) => f !== focus)
      : [...currentFocusAreas, focus];

    const newSettings = { ...currentSettings!, focusAreas: newFocusAreas };
    setLocalSettings(newSettings);
  };

  const handleSave = async () => {
    if (!localSettings) return;

    await updateMutation.mutateAsync(localSettings);
    setLocalSettings(null);
  };

  const handleReset = () => {
    setLocalSettings(null);
  };

  const hasChanges = localSettings !== null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!currentSettings) {
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
          Quick Settings
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Customize the tone, length, and focus of your sales pitches with
          simple controls
        </p>
      </div>

      {/* Tone Selection */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-1 text-sm font-semibold text-neutral-900">Tone</h4>
        <p className="mb-4 text-xs text-neutral-500">
          Choose the communication style for your pitches
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.values(PitchTone).map((tone) => (
            <button
              key={tone}
              onClick={() => handleToneChange(tone)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                currentSettings.tone === tone
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {TONE_LABELS[tone]}
            </button>
          ))}
        </div>
      </div>

      {/* Length Selection */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-1 text-sm font-semibold text-neutral-900">Length</h4>
        <p className="mb-4 text-xs text-neutral-500">
          Control how detailed your pitches should be
        </p>

        <div className="grid grid-cols-3 gap-3">
          {Object.values(PitchLength).map((length) => (
            <button
              key={length}
              onClick={() => handleLengthChange(length)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                currentSettings.length === length
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {LENGTH_LABELS[length]}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-1 text-sm font-semibold text-neutral-900">
          Focus Areas
        </h4>
        <p className="mb-4 text-xs text-neutral-500">
          Select one or more areas to emphasize (multi-select)
        </p>

        <div className="space-y-3">
          {Object.values(PitchFocus).map((focus) => {
            const isSelected = currentSettings.focusAreas.includes(focus);

            return (
              <button
                key={focus}
                onClick={() => handleFocusToggle(focus)}
                className={`flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      isSelected ? 'text-indigo-900' : 'text-neutral-900'
                    }`}
                  >
                    {FOCUS_LABELS[focus]}
                  </div>
                  <div
                    className={`mt-0.5 text-xs ${
                      isSelected ? 'text-indigo-700' : 'text-neutral-500'
                    }`}
                  >
                    {FOCUS_DESCRIPTIONS[focus]}
                  </div>
                </div>
              </button>
            );
          })}
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
