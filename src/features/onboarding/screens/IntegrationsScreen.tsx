'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSchedulingPreference } from '../hooks/useSchedulingPreference';
import { toast } from 'sonner';

export function IntegrationsScreen() {
  const router = useRouter();
  const { workflowId, calendlyLink, setCalendlyLink } = useOnboardingStore();

  const { mutate: saveSchedulingPreference, isPending: isSavingCalendly } =
    useSchedulingPreference();

  const [calendlyInput, setCalendlyInput] = useState(calendlyLink || '');
  const [calendlyError, setCalendlyError] = useState<string | null>(null);

  // Check if user has completed previous steps
  useEffect(() => {
    if (!workflowId) {
      router.push('/onboarding/form-builder');
    }
  }, [workflowId, router]);

  // Initialize calendly input from store
  useEffect(() => {
    if (calendlyLink) {
      setCalendlyInput(calendlyLink);
    }
  }, [calendlyLink]);

  const validateCalendlyLink = (url: string): boolean => {
    if (!url.trim()) return false;
    if (!url.includes('calendly.com/')) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveCalendly = () => {
    setCalendlyError(null);

    if (!calendlyInput.trim()) {
      setCalendlyError('Please enter a Calendly link');
      return;
    }

    if (!validateCalendlyLink(calendlyInput)) {
      setCalendlyError('Please enter a valid Calendly link (calendly.com)');
      return;
    }

    if (!workflowId) {
      toast.error('Workflow ID is missing');
      return;
    }

    // Save Calendly link
    saveSchedulingPreference({
      workflowId,
      schedulingType: 'CALENDLY',
      calendlyLink: calendlyInput.trim(),
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/configure');
  };

  const handleSkipCalendly = () => {
    toast.info('You can add your Calendly link later from settings', {
      duration: 3000,
    });
    router.push('/onboarding/configure');
  };

  const handleBack = () => {
    router.push('/onboarding/form-builder');
  };

  const handleChangeCalendly = () => {
    setCalendlyLink('');
    setCalendlyInput('');
    setCalendlyError(null);
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-[800px] flex-1 px-4 pt-6 pb-32 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-primary mb-3 flex items-center gap-2 text-sm font-medium transition-colors sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="relative">
            <div className="text-muted-foreground absolute top-0 right-0 text-xs font-medium sm:text-sm">
              Step 2 of 4
            </div>
            <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Calendar Settings
            </h1>
            <p className="text-muted-foreground max-w-[600px] text-sm leading-relaxed sm:text-base">
              Add your Calendly link so leads can easily schedule meetings with
              you.
            </p>
          </div>
        </div>

        {/* Calendar Card */}
        <div
          className={`border-border rounded-xl border bg-white p-4 shadow-sm transition-all sm:p-6 ${
            calendlyLink
              ? 'border-green-200 bg-gradient-to-b from-white to-green-50/20'
              : 'hover:border-neutral-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {/* Icon Container */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="w-full flex-1">
              {/* Header Row */}
              <div className="mb-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-foreground text-lg font-semibold">
                  Calendly Link
                </h2>
                <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Optional
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Add your Calendly link so leads can easily schedule meetings
                with you.
              </p>

              {/* Calendly Input or Saved State */}
              {calendlyLink ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 sm:py-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-sm font-semibold text-green-600">
                        Calendly link saved
                      </p>
                      <a
                        href={calendlyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs break-all text-indigo-600 hover:underline"
                      >
                        {calendlyLink}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleChangeCalendly}
                    className="h-9 border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:border-indigo-600 hover:text-indigo-600"
                  >
                    Change Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Input Group */}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="url"
                      placeholder="https://calendly.com/your-link"
                      value={calendlyInput}
                      onChange={(e) => {
                        setCalendlyInput(e.target.value);
                        setCalendlyError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveCalendly();
                        }
                      }}
                      className={`h-11 flex-1 border-neutral-200 bg-neutral-50 text-[15px] transition-all focus:border-indigo-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] ${
                        calendlyError ? 'border-red-500 bg-red-50' : ''
                      }`}
                      disabled={isSavingCalendly}
                    />
                    <Button
                      onClick={handleSaveCalendly}
                      disabled={isSavingCalendly || !calendlyInput.trim()}
                      variant="outline"
                      className="h-11 w-full border-neutral-200 px-5 text-sm font-semibold whitespace-nowrap text-neutral-700 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 sm:w-auto"
                    >
                      {isSavingCalendly ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>

                  {/* Error Message */}
                  {calendlyError && (
                    <p className="text-[13px] text-red-500">{calendlyError}</p>
                  )}

                  {/* Helper Text */}
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Find your Calendly link at{' '}
                    <a
                      href="https://calendly.com/event_types/user/me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      calendly.com/event_types
                    </a>
                  </p>

                  {/* Skip Button */}
                  <div>
                    <Button
                      variant="ghost"
                      onClick={handleSkipCalendly}
                      className="h-10 px-[18px] text-sm font-medium text-neutral-600 hover:text-neutral-700 hover:underline"
                    >
                      Skip for Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10">
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
        >
          {isSavingCalendly ? (
            'Saving...'
          ) : (
            <>
              Continue to Email Configuration
              <span className="hidden sm:inline"> →</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
