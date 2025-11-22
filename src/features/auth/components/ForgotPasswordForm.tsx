'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '@/validations/forgot-password';
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        // Always show success screen for security (prevent email enumeration)
        onSuccess(data.email);
      },
    });
  };

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

      {/* Heading */}
      <div className="mb-8">
        <h2 className="mb-3 text-2xl leading-tight font-bold tracking-[-0.02em] text-[#111827] md:text-[28px] lg:text-[32px]">
          Reset your password
        </h2>
        <p className="max-w-[400px] text-[15px] leading-normal text-[#6B7280]">
          Enter your email and we&apos;ll send you instructions to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={forgotPasswordMutation.isPending}
        aria-label="Forgot password form"
      >
        {/* Email Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="mb-1.5 block text-sm leading-[1.4] font-medium text-[#374151]"
          >
            Email address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={forgotPasswordMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-12 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.email ? 'border-[#EF4444] bg-[#FEF2F2]' : ''}`}
              {...register('email')}
              aria-required="true"
              aria-describedby={errors.email ? 'emailError' : 'emailHelp'}
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
          <span id="emailHelp" className="sr-only">
            Enter your email to receive password reset instructions
          </span>
          {errors.email && (
            <p
              id="emailError"
              className="mt-1.5 text-[13px] font-normal text-[#EF4444]"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className={`mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] disabled:cursor-wait disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none lg:h-11`}
          aria-busy={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>

        {/* Alternate Action */}
        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Remember your password?{' '}
          <Link
            href="/login"
            className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
