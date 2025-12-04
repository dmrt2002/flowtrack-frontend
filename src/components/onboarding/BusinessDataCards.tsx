/**
 * Business Data Cards Component
 *
 * Displays enriched business data in a grid of cards with staggered fade-in animation.
 */

'use client';

import { Building2, Briefcase, Users, Globe } from 'lucide-react';
import type { EnrichedCompanyData } from '@/types/onboarding-scraper';

interface BusinessDataCardsProps {
  data: EnrichedCompanyData;
  skipAnimation?: boolean;
}

export function BusinessDataCards({
  data,
  skipAnimation = false,
}: BusinessDataCardsProps) {
  const cards = [
    {
      id: 'industry',
      icon: Building2,
      label: 'Industry',
      value: data.industry,
      delay: skipAnimation ? 0 : 0,
    },
    {
      id: 'business-model',
      icon: Briefcase,
      label: 'Business Model',
      value: data.businessModel,
      delay: skipAnimation ? 0 : 100,
    },
    {
      id: 'company-size',
      icon: Users,
      label: 'Company Size',
      value: data.companySize,
      delay: skipAnimation ? 0 : 200,
    },
    {
      id: 'website',
      icon: Globe,
      label: 'Website',
      value: data.website,
      delay: skipAnimation ? 0 : 300,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`group relative rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-600 hover:shadow-lg ${
              skipAnimation ? '' : 'animate-fade-slide-up'
            }`}
            style={{
              animationDelay: `${card.delay}ms`,
              animationFillMode: 'backwards',
            }}
          >
            {/* Icon */}
            <div className="absolute top-4 right-4 opacity-60 transition-opacity group-hover:opacity-100">
              <Icon className="h-6 w-6 text-indigo-600" />
            </div>

            {/* Label */}
            <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {card.label}
            </p>

            {/* Value */}
            <p className="text-base leading-snug font-semibold text-gray-900">
              {card.value}
            </p>
          </div>
        );
      })}

      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

/**
 * Confidence Badge Component
 */
interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);

  let colorClass = 'bg-green-100 text-green-800';
  let label = 'High Confidence';

  if (confidence < 0.6) {
    colorClass = 'bg-amber-100 text-amber-800';
    label = 'Medium Confidence';
  } else if (confidence < 0.4) {
    colorClass = 'bg-red-100 text-red-800';
    label = 'Low Confidence';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span>
        {label} ({percentage}%)
      </span>
    </div>
  );
}
