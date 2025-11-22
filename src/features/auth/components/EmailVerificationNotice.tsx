'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useResendVerificationMutation } from '../hooks/useResendVerificationMutation';

interface EmailVerificationNoticeProps {
  email: string;
}

export function EmailVerificationNotice({
  email,
}: EmailVerificationNoticeProps) {
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isSending) return;

    setIsSending(true);
    try {
      await resendMutation.mutateAsync({ email });
      setCooldown(60);
    } catch {
      // Error handled by mutation
    } finally {
      setIsSending(false);
    }
  };

  const isResendDisabled =
    cooldown > 0 || isSending || resendMutation.isPending;

  return (
    <div className="animate-fade-in-up">
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
      <h2 className="mb-4 text-center text-2xl leading-tight font-bold tracking-[-0.02em] text-[#111827] md:text-[28px] lg:text-[32px]">
        Check your email
      </h2>

      {/* Body Text */}
      <div className="mb-8 text-center">
        <p className="mx-auto max-w-[400px] text-[15px] leading-normal text-[#6B7280]">
          We sent a verification link to{' '}
          <span className="rounded bg-[#EEF2FF] px-1.5 py-0.5 font-semibold text-[#111827]">
            {email}
          </span>
        </p>
        <p className="mx-auto mt-2 max-w-[400px] text-[15px] leading-normal text-[#6B7280]">
          Click the link in the email to activate your account and start
          automating.
        </p>
      </div>

      {/* Go to Login Button */}
      <div className="mb-6">
        <Button
          asChild
          className="mx-auto flex h-12 w-full max-w-[320px] items-center justify-center rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] lg:h-11"
        >
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>

      {/* Resend Link */}
      <div className="mb-6 text-center text-sm">
        <span className="text-[#6B7280]">Didn&apos;t receive it? </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResendDisabled}
          className="ml-1 font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline disabled:cursor-not-allowed disabled:text-[#9CA3AF] disabled:no-underline disabled:opacity-60"
          aria-label={
            cooldown > 0
              ? `Resend disabled. Wait ${cooldown} seconds`
              : 'Resend verification email'
          }
          aria-disabled={isResendDisabled}
        >
          {isSending || resendMutation.isPending
            ? 'Sending...'
            : cooldown > 0
              ? `Resent! Wait ${cooldown}s before resending again`
              : 'Resend verification email'}
        </button>
      </div>

      {/* Pro Tip Box */}
      <div className="mx-auto max-w-[400px] rounded-lg border-l-[3px] border-[#4F46E5] bg-[rgba(79,70,229,0.05)] p-3 text-left">
        <p className="text-[13px] leading-normal text-[#6B7280]">
          💡 Pro tip: Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    </div>
  );
}
