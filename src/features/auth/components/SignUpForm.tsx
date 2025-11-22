'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpSchema, SignUpFormData } from '@/validations/signup';
import { useSignUpMutation } from '../hooks/useSignUpMutation';
import { GoogleSignUpButton } from './GoogleSignUpButton';
import { EmailVerificationNotice } from './EmailVerificationNotice';
import Link from 'next/link';

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'number',
    label: 'Contains a number',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
];

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useSignUpMutation();

  // Watch password field for real-time validation
  const watchedPassword = watch('password', '');
  useEffect(() => {
    setPassword(watchedPassword);
  }, [watchedPassword]);

  const onSubmit = (data: SignUpFormData) => {
    // Only submit if all password requirements are met
    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(data.password)
    );
    if (!allRequirementsMet) {
      return;
    }

    // Prepare data - only include fullName if it has a value
    const submitData = {
      email: data.email,
      password: data.password,
      ...(data.fullName &&
        data.fullName.trim() && { fullName: data.fullName.trim() }),
    };

    signUpMutation.mutate(submitData, {
      onSuccess: () => {
        // Show email verification notice
        setRegisteredEmail(data.email);
      },
    });
  };

  // Check if all password requirements are met
  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(password)
  );

  // If signup was successful, show verification notice
  if (registeredEmail) {
    return <EmailVerificationNotice email={registeredEmail} />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="mb-2 text-2xl leading-tight font-bold tracking-[-0.02em] text-[#111827] md:text-[28px] lg:text-[32px]">
          Create your account
        </h2>
        <p className="text-base leading-normal font-normal text-[#6B7280]">
          Start automating your leads in under 10 minutes
        </p>
      </div>

      {/* Google Sign Up Button */}
      <div className="mb-8">
        <GoogleSignUpButton />
      </div>

      {/* Divider */}
      <div className="mb-6 flex items-center">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="px-4 text-[13px] tracking-[0.05em] text-[#9CA3AF] uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={signUpMutation.isPending}
      >
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fullName"
            className="mb-1.5 block text-sm leading-[1.4] font-medium text-[#374151]"
          >
            Full name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Smith"
            disabled={signUpMutation.isPending}
            className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.fullName ? 'border-[#EF4444] bg-[#FEF2F2]' : ''}`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-[13px] font-normal text-[#EF4444]">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
              disabled={signUpMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.email ? 'border-[#EF4444] bg-[#FEF2F2]' : ''}`}
              {...register('email')}
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
          {errors.email && (
            <p className="mt-1.5 text-[13px] font-normal text-[#EF4444]">
              {errors.email.message}
            </p>
          )}
          {/* Duplicate email error with sign in link */}
          {signUpMutation.isError &&
            (signUpMutation.error as any)?.response?.status === 409 && (
              <div className="mt-1.5">
                <p className="text-[13px] font-normal text-[#EF4444]">
                  This email is already registered.{' '}
                  <Link
                    href="/login"
                    className="font-medium underline hover:text-[#4338CA]"
                  >
                    Sign in instead?
                  </Link>
                </p>
              </div>
            )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="mb-1.5 block text-sm leading-[1.4] font-medium text-[#374151]"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={signUpMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-20 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.password ? 'border-[#EF4444] bg-[#FEF2F2]' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={signUpMutation.isPending}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[13px] font-normal text-[#EF4444]">
              {errors.password.message}
            </p>
          )}

          {/* Password Requirements Checklist */}
          {password && (
            <div className="mt-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3">
              <div
                className="space-y-2"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {passwordRequirements.map((requirement) => {
                  const isMet = requirement.test(password);
                  return (
                    <div
                      key={requirement.id}
                      className="flex items-center gap-2 text-[13px] leading-[1.8]"
                    >
                      {isMet ? (
                        <svg
                          className="h-4 w-4 text-[#10B981]"
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
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-[#9CA3AF]" />
                      )}
                      <span
                        className={isMet ? 'text-[#10B981]' : 'text-[#9CA3AF]'}
                      >
                        {requirement.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={signUpMutation.isPending || !allRequirementsMet}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] disabled:cursor-wait disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none lg:h-11`}
        >
          {signUpMutation.isPending ? (
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
              <span>Creating account...</span>
            </>
          ) : (
            'Create account'
          )}
        </Button>

        {/* Legal Agreement Text */}
        <div className="mt-4 text-center text-xs leading-normal text-[#6B7280]">
          By signing up, you agree to our{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#4F46E5] underline hover:text-[#4338CA]"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#4F46E5] underline hover:text-[#4338CA]"
          >
            Privacy Policy
          </a>
        </div>

        {/* Alternate Action */}
        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account?{' '}
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
