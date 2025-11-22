import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout';

export default function OnboardingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
