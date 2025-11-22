import { Suspense } from 'react';
import { OAuthConnectionScreen } from '@/features/onboarding/screens/OAuthConnectionScreen';

function OAuthConnectionPageContent() {
  return <OAuthConnectionScreen />;
}

export default function OAuthConnectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthConnectionPageContent />
    </Suspense>
  );
}
