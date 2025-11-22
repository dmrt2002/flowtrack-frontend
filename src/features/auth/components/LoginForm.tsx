'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, LoginFormData } from '@/validations/login';
import { useSignInMutation } from '../hooks/useSignInMutation';
import { GoogleSignInButton } from './GoogleSignInButton';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signInMutation = useSignInMutation();

  const onSubmit = (data: LoginFormData) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="mb-2 text-2xl leading-tight font-bold tracking-[-0.02em] text-[#111827] md:text-[28px] lg:text-[32px]">
          Welcome back
        </h2>
        <p className="text-base leading-normal font-normal text-[#6B7280]">
          Enter your credentials to access your automation dashboard
        </p>
      </div>

      {/* Google Sign In Button */}
      <div className="mb-8">
        <GoogleSignInButton />
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
        aria-busy={signInMutation.isPending}
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
              disabled={signInMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.email ? 'border-[#EF4444] bg-[#FEF2F2]' : ''} `}
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
              disabled={signInMutation.isPending}
              className={`h-12 rounded-lg border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-20 text-[15px] transition-all duration-150 ease-out focus:border-[#4F46E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] lg:h-11 ${errors.password ? 'border-[#EF4444] bg-[#FEF2F2]' : ''} `}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={signInMutation.isPending}
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
        </div>

        {/* Forgot Password Link */}
        <div className="mt-3 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={signInMutation.isPending}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg border-none bg-[#4F46E5] px-6 text-[15px] font-semibold text-white transition-all duration-150 ease-out hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(79,70,229,0.2)] disabled:cursor-wait disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none lg:h-11`}
        >
          {signInMutation.isPending ? (
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
              <span>Signing in...</span>
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        {/* Alternate Action */}
        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="ml-1 font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
