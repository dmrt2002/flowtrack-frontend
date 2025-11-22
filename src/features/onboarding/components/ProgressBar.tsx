'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mt-10 text-center">
      <p className="text-muted-foreground mb-3 text-sm font-medium">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="bg-muted mx-auto h-1 w-full max-w-[400px] overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
