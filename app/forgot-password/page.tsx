'use client';

import { useState } from 'react';
import { LoginLayout } from '@/features/auth/components/LoginLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '@/features/auth/components/ForgotPasswordSuccess';

export default function ForgotPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSuccess = (email: string) => {
    setUserEmail(email);
    setShowSuccess(true);
  };

  const handleTryAgain = () => {
    setShowSuccess(false);
    setUserEmail('');
  };

  return (
    <LoginLayout>
      {showSuccess ? (
        <ForgotPasswordSuccess email={userEmail} onTryAgain={handleTryAgain} />
      ) : (
        <ForgotPasswordForm onSuccess={handleSuccess} />
      )}
    </LoginLayout>
  );
}
