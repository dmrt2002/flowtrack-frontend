'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResendVerificationMutation } from '../hooks/useResendVerificationMutation';

interface EmailVerificationErrorProps {
  errorType?: 'expired' | 'invalid' | 'already-used' | 'generic';
  email?: string;
}

export function EmailVerificationError({
  errorType = 'generic',
  email,
}: EmailVerificationErrorProps) {
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState(email || '');
  const resendMutation = useResendVerificationMutation();

  const getHeading = () => {
    switch (errorType) {
      case 'expired':
        return 'Verification link expired';
      case 'invalid':
        return 'Invalid verification link';
      case 'already-used':
        return 'Link already used';
      default:
        return 'Verification failed';
    }
  };

  const getBodyText = () => {
    switch (errorType) {
      case 'expired':
        return 'This verification link is no longer valid. Request a new one to activate your account.';
      case 'invalid':
        return "This link doesn't appear to be valid. Please check your email for the correct verification link.";
      case 'already-used':
        return 'This email has already been verified. You can sign in to your account.';
      default:
        return 'Something went wrong with the verification. Please try again.';
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    try {
      await resendMutation.mutateAsync({ email: resendEmail });
      setShowResendModal(false);
    } catch {
      // Error handled by mutation
    }
  };

  const isAlreadyVerified = errorType === 'already-used';

  return (
    <>
      <div className="animate-fade-in-up">
        {/* Warning Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[rgba(251,191,36,0.1)]">
            <svg
              className="h-12 w-12 text-[#F59E0B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-center text-2xl leading-tight font-bold text-[#111827] md:text-[28px] lg:text-[32px]">
          {getHeading()}
        </h2>

        {/* Body Text */}
        <p className="mx-auto mb-8 max-w-[400px] text-center text-[15px] leading-normal text-[#6B7280]">
          {getBodyText()}
        </p>

        {/* Primary Button */}
        <div className="mb-6">
          {isAlreadyVerified ? (
            <Button
              asChild
              className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
            >
              <Link href="/login">Go to Login</Link>
            </Button>
          ) : (
            <Button
              onClick={() => setShowResendModal(true)}
              className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
            >
              Request New Link
            </Button>
          )}
        </div>

        {/* Already Verified Link */}
        {!isAlreadyVerified && (
          <div className="text-center text-sm text-[#6B7280]">
            Already verified?{' '}
            <Link
              href="/login"
              className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      {/* Resend Modal */}
      {showResendModal && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          onClick={() => setShowResendModal(false)}
        >
          <div
            className="fixed top-1/2 left-1/2 w-[90%] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#111827]">
                Request New Verification Link
              </h3>
              <button
                onClick={() => setShowResendModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <Label
                  htmlFor="resend-email"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Enter your email address
                </Label>
                <div className="relative">
                  <Input
                    id="resend-email"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={resendMutation.isPending}
                    className="h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11"
                  />
                  <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-[#9CA3AF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={resendMutation.isPending || !resendEmail}
                  className="h-12 flex-1 rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] disabled:cursor-wait disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none lg:h-11"
                >
                  {resendMutation.isPending
                    ? 'Sending...'
                    : 'Send Verification Link'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResendModal(false)}
                  disabled={resendMutation.isPending}
                  className="h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-white px-6 text-[15px] font-medium text-[#374151] transition-all duration-150 ease-out hover:border-[#D1D5DB] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 lg:h-11"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
