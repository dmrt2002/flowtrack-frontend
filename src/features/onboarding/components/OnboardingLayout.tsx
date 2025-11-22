'use client';

import { ReactNode } from 'react';
import { ProgressBar } from './ProgressBar';
import { useOnboardingStore } from '../store/onboardingStore';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { currentStep } = useOnboardingStore();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto">
        {children}
        <ProgressBar currentStep={currentStep} totalSteps={5} />
      </div>
    </div>
  );
}
