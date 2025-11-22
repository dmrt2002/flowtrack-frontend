'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ResetPasswordSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [redirectCancelled, setRedirectCancelled] = useState(false);

  useEffect(() => {
    if (redirectCancelled) return;

    if (countdown === 0) {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectCancelled, router]);

  const handleContinue = () => {
    setRedirectCancelled(true);
    router.push('/login');
  };

  return (
    <div className="animate-fade-in-up">
      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_8px_24px_rgba(16,185,129,0.3)]">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h2 className="mb-4 text-center text-2xl leading-tight font-bold text-[#111827] md:text-[28px] lg:text-[32px]">
        Password reset successful
      </h2>

      {/* Body Text */}
      <p className="mx-auto mb-8 max-w-[400px] text-center text-[15px] leading-normal text-[#6B7280]">
        Your password has been changed. You can now sign in with your new
        password.
      </p>

      {/* Sign in Button */}
      <div className="mb-4">
        <Button
          onClick={handleContinue}
          className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
        >
          Sign in to FlowTrack
        </Button>
      </div>

      {/* Auto-Redirect Countdown */}
      {!redirectCancelled && countdown > 0 && (
        <p
          className="text-center text-[13px] text-[#6B7280]"
          aria-live="polite"
          aria-atomic="true"
        >
          Auto-redirecting in{' '}
          <span
            className="font-semibold text-[#4F46E5]"
            aria-label={`${countdown} seconds`}
          >
            {countdown}
          </span>{' '}
          seconds...
        </p>
      )}
    </div>
  );
}
