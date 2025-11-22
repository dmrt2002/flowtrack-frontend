'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/validations/reset-password';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';

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

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
  onError: (
    errorType: 'expired' | 'invalid' | 'already-used' | 'generic'
  ) => void;
}

export function ResetPasswordForm({
  token,
  onSuccess,
  onError,
}: ResetPasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useResetPasswordMutation();

  // Watch password field for real-time validation
  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');
  useEffect(() => {
    setPassword(watchedPassword);
  }, [watchedPassword]);

  const onSubmit = (data: ResetPasswordFormData) => {
    // Only submit if all password requirements are met
    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(data.password)
    );
    if (!allRequirementsMet) {
      return;
    }

    resetPasswordMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: any) => {
          const statusCode = error?.response?.status;
          const message = error?.response?.data?.message?.toLowerCase() || '';

          if (statusCode === 401) {
            if (message.includes('expired')) {
              onError('expired');
            } else if (message.includes('invalid')) {
              onError('invalid');
            } else if (message.includes('already used')) {
              onError('already-used');
            } else {
              onError('generic');
            }
          } else {
            onError('generic');
          }
        },
      }
    );
  };

  // Check if all password requirements are met
  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(password)
  );

  // Check if passwords match
  const passwordsMatch =
    watchedPassword &&
    watchedConfirmPassword &&
    watchedPassword === watchedConfirmPassword;

  const isSubmitDisabled =
    !allRequirementsMet ||
    !passwordsMatch ||
    !watchedPassword ||
    !watchedConfirmPassword ||
    resetPasswordMutation.isPending;

  return (
    <div className="animate-fade-in-up">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="mb-3 text-2xl leading-tight font-bold tracking-[-0.02em] text-[#111827] md:text-[28px] lg:text-[32px]">
          Set new password
        </h2>
        <p className="max-w-[400px] text-[15px] leading-normal text-[#6B7280]">
          Choose a strong password for your account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={resetPasswordMutation.isPending}
      >
        {/* New Password Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="mb-1.5 block text-sm leading-[1.4] font-medium text-[#374151]"
          >
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              disabled={resetPasswordMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-20 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.password ? 'border-[#EF4444] bg-[#FEF2F2]' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={resetPasswordMutation.isPending}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showNewPassword ? 'Hide' : 'Show'}
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

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm leading-[1.4] font-medium text-[#374151]"
          >
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              disabled={resetPasswordMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] bg-[#F9FAFB] px-4 pr-20 text-[15px] transition-all duration-150 ease-out focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${
                errors.confirmPassword
                  ? 'border-[#EF4444] bg-[#FEF2F2]'
                  : passwordsMatch && watchedConfirmPassword
                    ? 'border-[#10B981]'
                    : 'border-[#E5E7EB]'
              }`}
              {...register('confirmPassword')}
            />
            {passwordsMatch && watchedConfirmPassword && (
              <div className="pointer-events-none absolute top-1/2 right-12 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-[#10B981]"
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
            )}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={resetPasswordMutation.isPending}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[13px] font-normal text-[#EF4444]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className={`mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] disabled:cursor-wait disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none lg:h-11`}
        >
          {resetPasswordMutation.isPending ? (
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
              <span>Resetting...</span>
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </div>
  );
}
