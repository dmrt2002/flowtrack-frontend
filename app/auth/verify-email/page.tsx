'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginLayout } from '@/features/auth/components/LoginLayout';
import { EmailVerificationSuccess } from '@/features/auth/components/EmailVerificationSuccess';
import { EmailVerificationError } from '@/features/auth/components/EmailVerificationError';
import { verifyEmail } from '@/features/auth/services';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'invalid' | 'already-used'
  >('loading');
  const [errorType, setErrorType] = useState<
    'expired' | 'invalid' | 'already-used' | 'generic'
  >('generic');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorType('invalid');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error: any) {
        const statusCode = error?.response?.status;
        const message = error?.response?.data?.message?.toLowerCase() || '';

        if (statusCode === 400) {
          if (message.includes('expired')) {
            setStatus('expired');
            setErrorType('expired');
          } else if (
            message.includes('already') ||
            message.includes('verified')
          ) {
            setStatus('already-used');
            setErrorType('already-used');
          } else {
            setStatus('error');
            setErrorType('invalid');
          }
        } else {
          setStatus('error');
          setErrorType('generic');
        }
      }
    };

    verify();
  }, [token]);

  return (
    <LoginLayout>
      {status === 'loading' && (
        <div className="animate-fade-in-up flex flex-col items-center justify-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#4F46E5]"></div>
          <p className="text-[15px] text-[#6B7280]">Verifying your email...</p>
        </div>
      )}
      {status === 'success' && <EmailVerificationSuccess />}
      {(status === 'error' ||
        status === 'expired' ||
        status === 'already-used') && (
        <EmailVerificationError errorType={errorType} />
      )}
    </LoginLayout>
  );
}
