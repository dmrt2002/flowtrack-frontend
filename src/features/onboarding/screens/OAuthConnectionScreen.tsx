'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOnboardingStore } from '../store/onboardingStore';
import { useOAuthCompleteMutation } from '../hooks/useOAuthCompleteMutation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mainUrl } from '@/url/url';

export function OAuthConnectionScreen() {
  const searchParams = useSearchParams();
  const { oauthConnection } = useOnboardingStore();
  const { mutate: completeOAuth } = useOAuthCompleteMutation();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const provider = searchParams.get('provider');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (success === 'true' && provider && email) {
      completeOAuth({
        provider: provider as 'gmail' | 'outlook',
        email,
      });
    }

    if (error) {
      // Error handling would go here
      console.error('OAuth error:', error);
    }
  }, [searchParams, completeOAuth]);

  const handleConnectGmail = () => {
    setIsConnecting(true);
    const redirectUrl = `${window.location.origin}/onboarding/connect`;
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${mainUrl.onboardingOAuthGmail}?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleConnectOutlook = () => {
    setIsConnecting(true);
    const redirectUrl = `${window.location.origin}/onboarding/connect`;
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${mainUrl.onboardingOAuthOutlook}?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (oauthConnection.isConnected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-10 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Email Connected!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Successfully connected {oauthConnection.email}
            </p>
            <p className="text-muted-foreground text-sm">
              Redirecting to simulation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-10 py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Connect your email
          </h1>
          <p className="text-muted-foreground">
            We need access to send emails on your behalf
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Gmail</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleConnectGmail}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Gmail'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleConnectOutlook}
                disabled={isConnecting}
                className="w-full"
                variant="outline"
              >
                {isConnecting ? 'Connecting...' : 'Connect Outlook'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>🔒</span>
          <p>Your credentials are encrypted and never stored</p>
        </div>
      </div>
    </div>
  );
}
