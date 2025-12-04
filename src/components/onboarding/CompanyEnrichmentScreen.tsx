/**
 * Company Enrichment Screen Component
 *
 * Main onboarding step for analyzing company websites and extracting business intelligence.
 * Layout matches FormBuilderScreen: Fixed header, content area, fixed footer.
 */

'use client';

import { useState, useEffect } from 'react';
import { Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useCompanyEnrichment,
  useEnrichmentStatus,
} from '@/hooks/useCompanyEnrichment';
import { EnrichmentLoadingState } from './EnrichmentLoadingState';
import { TypingAnimation, useTypingAnimationState } from './TypingAnimation';
import { BusinessDataCards, ConfidenceBadge } from './BusinessDataCards';
import type { EnrichedCompanyData } from '@/types/onboarding-scraper';

interface CompanyEnrichmentScreenProps {
  workflowId: string;
  companyName?: string;
  onComplete: (data: EnrichedCompanyData) => void;
  onSkip: () => void;
}

export function CompanyEnrichmentScreen({
  workflowId,
  companyName: initialCompanyName,
  onComplete,
  onSkip,
}: CompanyEnrichmentScreenProps) {
  const [inputValue, setInputValue] = useState(initialCompanyName || '');
  const [enrichedData, setEnrichedData] = useState<EnrichedCompanyData | null>(
    null
  );
  const [showDataCards, setShowDataCards] = useState(false);

  // Animation state management
  const { hasCompletedAnimation, markAnimationComplete } =
    useTypingAnimationState(workflowId);

  // API hooks
  const {
    mutate: scrapeCompany,
    isPending,
    isError,
    error,
  } = useCompanyEnrichment();
  const { data: statusData } = useEnrichmentStatus(workflowId, !enrichedData);

  // Check if enrichment already exists on mount
  useEffect(() => {
    if (statusData?.exists && statusData.data) {
      setEnrichedData(statusData.data);
      setShowDataCards(true);
    }
  }, [statusData]);

  // Handle scraping
  const handleAnalyze = () => {
    if (!inputValue.trim()) return;

    // Determine if input is a URL or company name
    const isUrl =
      inputValue.includes('.') &&
      (inputValue.includes('http') || !inputValue.includes(' '));

    scrapeCompany(
      {
        workflowId,
        ...(isUrl ? { website: inputValue } : { companyName: inputValue }),
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setEnrichedData(response.data);
          }
        },
      }
    );
  };

  // Handle typing animation complete
  const handleTypingComplete = () => {
    markAnimationComplete();
    setShowDataCards(true);
  };

  // Handle continue
  const handleContinue = () => {
    if (enrichedData) {
      onComplete(enrichedData);
    }
  };

  // Handle edit manually
  const handleEditManually = () => {
    // Reset state and show input form
    setEnrichedData(null);
    setShowDataCards(false);
  };

  // Render states
  const isLoading = isPending;
  const isSuccess = !!enrichedData;
  const showInput = !isLoading && !enrichedData;
  const showResults = !isLoading && !!enrichedData;

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="border-border bg-background z-20 flex-shrink-0 border-b px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Tell us about your business
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              We&apos;ll analyze your website to personalize your setup
            </p>
          </div>
          <div className="text-muted-foreground text-xs font-medium sm:text-sm">
            Step 2 of 4
          </div>
        </div>
      </div>

      {/* Main Content Area - Fixed height, no scroll on container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Animated Visual - Desktop only, fills full height */}
        <div className="hidden h-full flex-1 lg:flex">
          <EnrichmentLoadingState isSuccess={isSuccess} />
        </div>

        {/* Right Panel: Form Content - Only this scrolls */}
        <div className="flex h-full flex-1 flex-col overflow-y-auto bg-white lg:max-w-[50%]">
          <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-32 sm:px-6 sm:py-12 lg:px-10">
            {/* Input State */}
            {showInput && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="company-input"
                    className="text-foreground block text-sm font-medium"
                  >
                    Website or Company Name
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="company-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="https://example.com or Acme Corporation"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring block w-full rounded-lg border px-4 py-3 pr-12 text-base transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Globe className="text-muted-foreground absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter your website URL or company name
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!inputValue.trim()}
                  className="w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white"
                >
                  Analyze Website
                </Button>
              </div>
            )}

            {/* Loading State - Mobile */}
            {isLoading && (
              <div className="flex h-64 items-center justify-center lg:hidden">
                <div className="text-center">
                  <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
                  <p className="text-foreground text-lg font-semibold">
                    Analyzing your website...
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    This will take just a moment
                  </p>
                </div>
              </div>
            )}

            {/* Results State */}
            {showResults && enrichedData && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-foreground text-2xl font-bold">
                    Here&apos;s what we found
                  </h2>
                  <div className="mt-3">
                    <ConfidenceBadge confidence={enrichedData.confidence} />
                  </div>
                </div>

                {/* Business Summary with Typing Animation */}
                <div className="bg-muted rounded-xl border p-6">
                  <TypingAnimation
                    text={enrichedData.summary}
                    onComplete={handleTypingComplete}
                    skipAnimation={hasCompletedAnimation}
                  />
                </div>

                {/* Data Cards (appear after typing) */}
                {showDataCards && (
                  <BusinessDataCards
                    data={enrichedData}
                    skipAnimation={hasCompletedAnimation}
                  />
                )}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-5">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-500" />
                  <div className="ml-3">
                    <h3 className="text-base font-semibold text-gray-900">
                      We couldn&apos;t analyze your website
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">
                      {error?.message ||
                        'An unexpected error occurred. Please try again.'}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleAnalyze}
                        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={onSkip}
                        className="text-sm font-medium text-gray-600 hover:text-gray-700 hover:underline"
                      >
                        Skip this step
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Fixed at bottom */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10 lg:py-6">
        {/* Skip button - left side */}
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground order-2 w-full sm:order-1 sm:w-auto"
        >
          Skip this step
        </Button>

        {/* Action buttons - right side */}
        <div className="order-1 flex w-full gap-3 sm:order-2 sm:w-auto">
          {showResults && enrichedData && showDataCards ? (
            <>
              <Button
                variant="outline"
                onClick={handleEditManually}
                className="flex-1 sm:flex-initial"
              >
                Edit Manually
              </Button>
              <Button
                onClick={handleContinue}
                className="hover:shadow-primary/30 flex-1 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:flex-initial"
              >
                Continue to Integrations
                <ArrowRight className="ml-2 hidden h-4 w-4 sm:inline" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAnalyze}
              disabled={!inputValue.trim() || isPending}
              className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
            >
              {isPending ? 'Analyzing...' : 'Analyze Website'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
