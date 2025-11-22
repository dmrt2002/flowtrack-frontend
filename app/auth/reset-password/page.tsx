'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginLayout } from '@/features/auth/components/LoginLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { ResetPasswordSuccess } from '@/features/auth/components/ResetPasswordSuccess';
import { ResetPasswordError } from '@/features/auth/components/ResetPasswordError';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<
    'form' | 'success' | 'error' | 'expired' | 'invalid' | 'already-used'
  >('form');
  const [errorType, setErrorType] = useState<
    'expired' | 'invalid' | 'already-used' | 'generic'
  >('generic');

  const handleSuccess = () => {
    setStatus('success');
  };

  const handleError = (
    errorType: 'expired' | 'invalid' | 'already-used' | 'generic'
  ) => {
    setErrorType(errorType);
    if (errorType === 'expired') {
      setStatus('expired');
    } else if (errorType === 'invalid') {
      setStatus('invalid');
    } else if (errorType === 'already-used') {
      setStatus('already-used');
    } else {
      setStatus('error');
    }
  };

  // If no token, show invalid error
  if (!token) {
    return (
      <LoginLayout>
        <ResetPasswordError errorType="invalid" />
      </LoginLayout>
    );
  }

  return (
    <LoginLayout>
      {status === 'form' && (
        <ResetPasswordForm
          token={token}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
      {status === 'success' && <ResetPasswordSuccess />}
      {(status === 'error' ||
        status === 'expired' ||
        status === 'invalid' ||
        status === 'already-used') && (
        <ResetPasswordError errorType={errorType} />
      )}
    </LoginLayout>
  );
}
