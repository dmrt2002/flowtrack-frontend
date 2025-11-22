'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Strategy } from '../types';

interface StrategyCardProps {
  strategy: Strategy;
  isSelected: boolean;
  onSelect: () => void;
}

export function StrategyCard({
  strategy,
  isSelected,
  onSelect,
}: StrategyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'relative cursor-pointer overflow-hidden transition-all duration-200',
        'flex h-full flex-col border-2',
        isSelected
          ? 'hover:scale-100'
          : 'border-border hover:scale-105 hover:shadow-lg'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      style={
        isSelected
          ? {
              borderColor: strategy.color,
              backgroundColor: strategy.backgroundColor,
            }
          : isHovered
            ? { borderColor: strategy.color }
            : undefined
      }
    >
      <CardContent className="flex-1 p-10 text-center">
        {/* Icon Container */}
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px]"
          style={{ backgroundColor: strategy.backgroundColor }}
        >
          <div
            className="text-5xl"
            style={{ color: strategy.color }}
            aria-hidden="true"
          >
            {strategy.icon}
          </div>
        </div>

        {/* Tagline */}
        <p
          className="mb-3 text-sm font-semibold tracking-wider uppercase"
          style={{ color: strategy.color }}
        >
          {strategy.tagline}
        </p>

        {/* Title */}
        <h3 className="text-foreground mb-3 text-2xl leading-tight font-bold tracking-tight">
          {strategy.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 text-[15px] leading-relaxed">
          {strategy.description}
        </p>

        {/* Benefits List */}
        <ul className="mb-6 space-y-2 px-2 text-left">
          {strategy.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span
                className="mt-0.5 flex-shrink-0 text-lg"
                style={{ color: strategy.color }}
              >
                ✓
              </span>
              <span className="text-muted-foreground leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto p-6 pt-0">
        <Button
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full gap-2 text-[15px] font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          Select Strategy
          <span className="text-lg">→</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
