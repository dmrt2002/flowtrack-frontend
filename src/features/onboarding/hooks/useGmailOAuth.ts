import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface GmailOAuthResponse {
  success: boolean;
  message: string;
  data: {
    authUrl: string;
  };
}

export function useGmailOAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { setGmailConnection } = useOnboardingStore();

  const initiateOAuth = useCallback(async () => {
    setIsConnecting(true);
    try {
      const response = await request.get<GmailOAuthResponse>(
        mainUrl.oauthGmailInitiate
      );

      if (!response.data.success || !response.data.data.authUrl) {
        throw new Error('Failed to initiate Gmail OAuth');
      }

      const authUrl = response.data.data.authUrl;

      // Open OAuth in popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'Gmail OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Check if popup was blocked
      if (!popup || popup.closed) {
        toast.error('Please allow popups to connect Gmail');
        setIsConnecting(false);
        return;
      }

      // Listen for OAuth callback message
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GMAIL_OAUTH_SUCCESS') {
          setGmailConnection(event.data.email);
          toast.success(`Gmail connected: ${event.data.email}`);
          popup.close();
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        } else if (event.data.type === 'GMAIL_OAUTH_ERROR') {
          const errorMessage = event.data.error || 'Failed to connect Gmail';
          toast.error(errorMessage);
          popup.close();
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup listener if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener('message', handleMessage);
          clearInterval(checkClosed);
          setIsConnecting(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Gmail OAuth error:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to initiate Gmail connection';
      toast.error(errorMessage);
      setIsConnecting(false);
    }
  }, [setGmailConnection]);

  return {
    initiateOAuth,
    isConnecting,
  };
}
