'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ForgotPasswordSuccessProps {
  email: string;
  onTryAgain: () => void;
}

export function ForgotPasswordSuccess({
  email,
  onTryAgain,
}: ForgotPasswordSuccessProps) {
  return (
    <div className="animate-fade-in-up">
      {/* Back Navigation */}
      <Link
        href="/login"
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827]"
      >
        <svg
          className="h-4 w-4 transition-transform duration-150 ease-out hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to login
      </Link>

      {/* Email Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF]">
          <svg
            className="h-8 w-8 text-[#4F46E5]"
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

      {/* Heading */}
      <h2 className="mb-4 text-center text-2xl leading-tight font-bold text-[#111827] md:text-[28px] lg:text-[32px]">
        Check your email
      </h2>

      {/* Body Text */}
      <div className="mb-8 text-center">
        <p className="mx-auto max-w-[400px] text-[15px] leading-normal text-[#6B7280]">
          If an account exists for{' '}
          <span className="rounded bg-[#EEF2FF] px-1.5 py-0.5 font-semibold text-[#111827]">
            {email}
          </span>
          , we sent password reset instructions.
        </p>
      </div>

      {/* Back to Login Button */}
      <div className="mb-6">
        <Button
          asChild
          className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
        >
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mb-6 text-center text-sm text-[#6B7280]">
        Didn&apos;t receive it?{' '}
        <button
          type="button"
          onClick={onTryAgain}
          className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
        >
          Try again
        </button>
        {' or '}
        <a
          href="mailto:support@flowtrack.com"
          className="font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
        >
          contact support
        </a>
      </div>

      {/* Pro Tip Box */}
      <div className="mx-auto max-w-[400px] rounded-lg border-l-[3px] border-[#4F46E5] bg-[rgba(79,70,229,0.05)] p-3 text-left">
        <p className="text-[13px] leading-normal text-[#6B7280]">
          💡 Check your spam folder if you don&apos;t see it within 5 minutes.
        </p>
      </div>
    </div>
  );
}
