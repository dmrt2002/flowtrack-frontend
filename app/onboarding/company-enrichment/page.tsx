/**
 * Company Enrichment Onboarding Page
 *
 * Step 2 of the onboarding flow: Analyze company website and extract business intelligence
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyEnrichmentScreen } from '@/components/onboarding/CompanyEnrichmentScreen';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import type { EnrichedCompanyData } from '@/types/onboarding-scraper';

export default function CompanyEnrichmentPage() {
  const router = useRouter();
  const { workflowId, companyName, setEnrichedCompany, completeStep } =
    useOnboardingStore();

  // Redirect if no workflow ID
  useEffect(() => {
    if (!workflowId) {
      router.push('/onboarding/form-builder');
    }
  }, [workflowId, router]);

  // Handle enrichment complete
  const handleComplete = (data: EnrichedCompanyData) => {
    // Save to store
    setEnrichedCompany(data);

    // Mark step as complete
    completeStep(2);

    // Navigate to next step (integrations)
    router.push('/onboarding/integrations');
  };

  // Handle skip
  const handleSkip = () => {
    // Mark step as complete without data
    completeStep(2);

    // Navigate to next step
    router.push('/onboarding/integrations');
  };

  if (!workflowId) {
    return null;
  }

  return (
    <CompanyEnrichmentScreen
      workflowId={workflowId}
      companyName={companyName || undefined}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
