/**
 * Preview Tab
 *
 * Live preview of pitch generation with sample lead data
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Eye } from 'lucide-react';
import { usePitchConfig } from '../../hooks/use-pitch-config';

// Sample lead data for testing
const SAMPLE_LEADS = [
  {
    id: 'sample-1',
    name: 'TechCorp Inc',
    industry: 'Software Development',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    employeeCount: '50-200',
    foundedYear: 2018,
    description:
      'B2B SaaS platform for project management and team collaboration',
  },
  {
    id: 'sample-2',
    name: 'HealthWise Solutions',
    industry: 'Healthcare',
    techStack: ['Python', 'Django', 'MySQL', 'Azure'],
    employeeCount: '200-500',
    foundedYear: 2015,
    description:
      'Healthcare analytics platform helping hospitals optimize operations',
  },
  {
    id: 'sample-3',
    name: 'RetailPro Systems',
    industry: 'E-commerce',
    techStack: ['Vue.js', 'Laravel', 'Redis', 'GCP'],
    employeeCount: '10-50',
    foundedYear: 2020,
    description: 'AI-powered inventory management for online retailers',
  },
];

export function PreviewTab() {
  const { data: config, isLoading: configLoading } = usePitchConfig();
  const [selectedLead, setSelectedLead] = useState(SAMPLE_LEADS[0]);
  const [generatedPitch, setGeneratedPitch] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Note: In a real implementation, this would call a preview endpoint
      // that doesn't save to the database but generates a test pitch
      // For now, we'll simulate the generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock generated pitch
      const mockPitch = `Hi ${selectedLead.name} team,

I noticed you're in the ${selectedLead.industry} space and using ${selectedLead.techStack.slice(0, 2).join(' and ')} in your stack.

Based on your company profile (${selectedLead.employeeCount} employees, founded ${selectedLead.foundedYear}), I think our solution could help with:

• Streamlining your development workflow
• Reducing infrastructure costs by up to 30%
• Improving team collaboration and productivity

${selectedLead.description ? `Given that you're focused on "${selectedLead.description}", our platform's integration capabilities would be particularly valuable.` : ''}

Would you be open to a quick 15-minute call to explore how we can help?

Best regards`;

      setGeneratedPitch(mockPitch);
    } catch {
      setError('Failed to generate preview pitch');
    } finally {
      setIsGenerating(false);
    }
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!config) {
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
          Test & Preview
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Test your pitch configuration with sample lead data before applying to
          real leads
        </p>
      </div>

      {/* Current Configuration Summary */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-neutral-900">
          Current Configuration
        </h4>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Settings */}
          <div className="space-y-2 rounded-lg bg-neutral-50 p-4">
            <h5 className="text-xs font-semibold text-neutral-700">
              Quick Settings
            </h5>
            <div className="space-y-1 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Tone:</span>
                <span className="font-medium text-neutral-900">
                  {config.quickSettings.tone}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Length:</span>
                <span className="font-medium text-neutral-900">
                  {config.quickSettings.length}
                </span>
              </div>
              <div>
                <span>Focus Areas:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {config.quickSettings.focusAreas.map((focus) => (
                    <span
                      key={focus}
                      className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-2 rounded-lg bg-neutral-50 p-4">
            <h5 className="text-xs font-semibold text-neutral-700">
              Advanced Settings
            </h5>
            <div className="space-y-1 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Custom Prompt:</span>
                <span className="font-medium text-neutral-900">
                  {config.advancedConfig.useCustomPrompt
                    ? 'Enabled'
                    : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Temperature:</span>
                <span className="font-medium text-neutral-900">
                  {config.advancedConfig.temperature?.toFixed(2) || '0.70'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Tokens:</span>
                <span className="font-medium text-neutral-900">
                  {config.advancedConfig.maxTokens || 2000}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Lead Selection */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-neutral-900">
          Select Sample Lead
        </h4>

        <div className="grid gap-3 md:grid-cols-3">
          {SAMPLE_LEADS.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                selectedLead.id === lead.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <h5
                className={`mb-1 text-sm font-semibold ${
                  selectedLead.id === lead.id
                    ? 'text-indigo-900'
                    : 'text-neutral-900'
                }`}
              >
                {lead.name}
              </h5>
              <p
                className={`mb-2 text-xs ${
                  selectedLead.id === lead.id
                    ? 'text-indigo-700'
                    : 'text-neutral-600'
                }`}
              >
                {lead.industry}
              </p>
              <div className="flex flex-wrap gap-1">
                {lead.techStack.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className={`rounded px-2 py-0.5 text-xs ${
                      selectedLead.id === lead.id
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
                {lead.techStack.length > 2 && (
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      selectedLead.id === lead.id
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    +{lead.techStack.length - 2}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Lead Details */}
        <div className="mt-4 rounded-lg bg-neutral-50 p-4">
          <h5 className="mb-2 text-xs font-semibold text-neutral-700">
            Lead Details
          </h5>
          <div className="space-y-1 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Company:</span>
              <span className="font-medium text-neutral-900">
                {selectedLead.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Industry:</span>
              <span className="font-medium text-neutral-900">
                {selectedLead.industry}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Employees:</span>
              <span className="font-medium text-neutral-900">
                {selectedLead.employeeCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Founded:</span>
              <span className="font-medium text-neutral-900">
                {selectedLead.foundedYear}
              </span>
            </div>
            <div>
              <span>Tech Stack:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedLead.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <span>Description:</span>
              <p className="mt-1 text-neutral-700">
                {selectedLead.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Preview Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGeneratePreview}
          disabled={isGenerating}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Preview...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-5 w-5" />
              Generate Preview Pitch
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generated Pitch Preview */}
      {generatedPitch && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-neutral-900">
              Generated Pitch Preview
            </h4>
            <Button
              onClick={handleGeneratePreview}
              variant="outline"
              size="sm"
              disabled={isGenerating}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="rounded-lg bg-neutral-50 p-4">
            <pre className="font-sans text-sm whitespace-pre-wrap text-neutral-700">
              {generatedPitch}
            </pre>
          </div>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> This is a preview using sample data. The
              actual pitch generated for your leads will use real enrichment
              data and may vary based on the specific lead information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
