/**
 * Enrichment Loading State Component
 *
 * Animated visual for the left panel during website scraping.
 * Features: Gradient background, floating orbs, progress ring, particles.
 */

'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EnrichmentLoadingStateProps {
  isSuccess: boolean;
}

export function EnrichmentLoadingState({
  isSuccess,
}: EnrichmentLoadingStateProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    // Generate particles on mount
    const generatedParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 6,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden transition-all duration-800 ${
        isSuccess
          ? 'bg-gradient-to-br from-green-500 to-green-600'
          : 'bg-gradient-to-br from-indigo-600 to-purple-600'
      }`}
    >
      {/* Gradient Orbs */}
      <div
        className="animate-float-slow absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="animate-float-reverse absolute -right-12 -bottom-32 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute h-1 w-1 rounded-full bg-white/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        {isSuccess ? (
          // Success State: Checkmark
          <div className="animate-scale-in">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2
                className="h-16 w-16 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        ) : (
          // Loading State: Progress Ring
          <div className="relative h-32 w-32">
            <svg
              className="h-full w-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="animate-spin-progress"
                style={{
                  animation: 'spin-progress 2s linear infinite',
                }}
              />
            </svg>
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 animate-pulse rounded-full bg-white/30" />
            </div>
          </div>
        )}

        {/* Text */}
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-white opacity-95">
            {isSuccess ? 'Analysis Complete!' : 'Analyzing your website...'}
          </p>
          <p className="mt-2 text-sm text-white/80">
            {isSuccess ? 'Loading results' : 'This will take just a moment'}
          </p>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .particle {
          animation: particle-float 8s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 20px) scale(1.15);
          }
        }

        @keyframes particle-float {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(
                ${Math.random() * 100 - 50}px,
                ${Math.random() * 100 - 50}px
              )
              scale(1);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes spin-progress {
          0% {
            stroke-dashoffset: 283;
            transform: rotate(0deg);
          }
          100% {
            stroke-dashoffset: 0;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
