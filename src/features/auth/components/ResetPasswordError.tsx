'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ResetPasswordErrorProps {
  errorType: 'expired' | 'invalid' | 'already-used' | 'generic';
}

export function ResetPasswordError({ errorType }: ResetPasswordErrorProps) {
  const getHeading = () => {
    switch (errorType) {
      case 'expired':
        return 'Reset link expired';
      case 'invalid':
        return 'Invalid reset link';
      case 'already-used':
        return 'Password already reset';
      default:
        return 'Verification failed';
    }
  };

  const getBodyText = () => {
    switch (errorType) {
      case 'expired':
        return 'This password reset link has expired for security. Links are valid for 1 hour.';
      case 'invalid':
        return "This link doesn't appear to be valid. It may have already been used or is incorrect.";
      case 'already-used':
        return 'This link has already been used to reset your password.';
      default:
        return 'Something went wrong with the reset link. Please try again.';
    }
  };

  const isAlreadyUsed = errorType === 'already-used';

  return (
    <div className="animate-fade-in-up">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        {isAlreadyUsed ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#10B981] bg-[rgba(16,185,129,0.1)]">
            <svg
              className="h-12 w-12 text-[#10B981]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
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
        )}
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
        {isAlreadyUsed ? (
          <Button
            asChild
            className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
          >
            <Link href="/login">Go to Login</Link>
          </Button>
        ) : (
          <Button
            asChild
            className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
          >
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
        )}
      </div>

      {/* Alternate Action */}
      <div className="text-center text-sm text-[#6B7280]">
        {isAlreadyUsed ? (
          <>
            Forgot again?{' '}
            <Link
              href="/forgot-password"
              className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
            >
              Request new link
            </Link>
          </>
        ) : (
          <>
            Remember your password?{' '}
            <Link
              href="/login"
              className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
