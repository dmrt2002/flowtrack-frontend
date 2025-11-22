'use client';

import { useState } from 'react';
import { useStrategyMutation } from '../hooks/useStrategyMutation';
import { StrategyCard } from '../components/StrategyCard';
import type { Strategy, StrategyId } from '../types';

// Strategy data matching the design spec
const strategies: Strategy[] = [
  {
    id: 'gatekeeper',
    name: 'The Gatekeeper',
    description: 'Reject low budgets. Schedule high-value leads.',
    tagline: 'FILTER & QUALIFY',
    icon: '🛡️',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    hoverColor: '#2563eb',
    templateId: 'tmpl_gatekeeper_001',
    benefits: [
      'Saves 10 hours/week on unqualified calls',
      '80% increase in meeting quality',
      'One-click budget threshold setup',
    ],
    xRayPreview: ['Form', 'Budget ≥ $X?', 'Yes: Calendar / No: Polite Decline'],
  },
  {
    id: 'nurturer',
    name: 'The Nurturer',
    description: '5-email drip sequence for warm leads.',
    tagline: 'LONG-TERM FOLLOW UP',
    icon: '🌱',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    hoverColor: '#059669',
    templateId: 'tmpl_nurturer_001',
    benefits: [
      'Automates relationship-building',
      '3× higher conversion over 30 days',
      'Template emails included',
    ],
    xRayPreview: ['Form', 'Wait 3 Days', 'Email 1', 'Email 2', '...'],
  },
  {
    id: 'closer',
    name: 'The Closer',
    description: 'Direct booking focus. Strike while hot.',
    tagline: 'SPEED TO CALL',
    icon: '⚡',
    color: '#8b5cf6',
    backgroundColor: '#f5f3ff',
    hoverColor: '#7c3aed',
    templateId: 'tmpl_closer_001',
    benefits: [
      'Books calls within 5 minutes',
      '90% show-up rate',
      'Instant Calendly integration',
    ],
    xRayPreview: ['Form', 'Send Calendly', 'Reminder Emails'],
  },
];

export function StrategySelectionScreen() {
  const [selectedStrategyId, setSelectedStrategyId] =
    useState<StrategyId | null>(null);
  const { mutate: selectStrategy, isPending } = useStrategyMutation();

  const handleSelect = (strategy: Strategy) => {
    setSelectedStrategyId(strategy.id);
    selectStrategy({
      strategyId: strategy.id,
      templateId: strategy.templateId,
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-10 py-16">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          FlowTrack
        </h1>
      </div>

      {/* Sub-headline */}
      <p className="text-muted-foreground mx-auto mb-12 max-w-[640px] text-center text-lg leading-relaxed">
        Don&apos;t start from scratch. Choose a proven workflow.
      </p>

      {/* Strategy Cards Grid */}
      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isSelected={selectedStrategyId === strategy.id}
            onSelect={() => handleSelect(strategy)}
          />
        ))}
      </div>

      {isPending && (
        <div className="text-muted-foreground text-center text-sm">
          Saving your selection...
        </div>
      )}
    </div>
  );
}
