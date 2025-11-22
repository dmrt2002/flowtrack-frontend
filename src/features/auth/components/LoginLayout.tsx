'use client';

import { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand Panel - Left (40% on desktop, collapsed header on mobile/tablet) */}
      {/* Desktop Brand Panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] lg:flex lg:w-[40%]">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 -right-32 h-[500px] w-[500px] animate-pulse rounded-full bg-white/10 blur-[80px]" />
        <div
          className="absolute bottom-0 -left-32 h-[400px] w-[400px] animate-pulse rounded-full bg-white/10 blur-[80px]"
          style={{ animationDelay: '1s' }}
        />

        {/* Logo */}
        <div className="absolute top-10 left-10 z-10">
          <div className="text-2xl font-bold text-white">FlowTrack</div>
        </div>

        {/* Hero Content - Centered */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10">
          {/* Glassmorphism Card */}
          <div className="animate-float flex h-[360px] w-full max-w-[400px] flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-[20px]">
            {/* Simplified workflow preview */}
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="h-0.5 w-12 bg-white/30" />
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="h-0.5 w-12 bg-white/30" />
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8 text-white"
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
          </div>

          {/* Tagline */}
          <h2 className="mt-8 max-w-[320px] text-center text-2xl leading-tight font-semibold tracking-tight text-white">
            Template-First Automation for Solopreneurs
          </h2>

          {/* Social Proof */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-5 py-3 backdrop-blur-[10px]">
            <div className="flex items-center gap-2 text-sm font-medium text-white/95">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>10,000+ leads automated this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Brand Header */}
      {/* Mobile: 80px height, Tablet: 200px height */}
      <div className="flex h-20 w-full items-center justify-center bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] px-6 md:h-[200px] md:px-8 lg:hidden">
        <div className="text-xl font-bold text-white md:text-2xl">
          FlowTrack
        </div>
      </div>

      {/* Form Panel - Right (60% on desktop, full width on mobile/tablet) */}
      <div className="flex min-h-[calc(100vh-80px)] flex-1 items-center justify-center bg-white md:min-h-[calc(100vh-200px)] lg:min-h-0 lg:w-[60%]">
        <div className="mx-auto w-full max-w-[480px] px-6 py-8 md:px-12 md:py-12 lg:px-8 lg:py-0">
          {children}
        </div>
      </div>
    </div>
  );
}
