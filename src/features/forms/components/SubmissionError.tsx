'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SubmissionErrorProps {
  message: string;
  onRetry?: () => void;
}

export function SubmissionError({ message, onRetry }: SubmissionErrorProps) {
  return (
    <div className="animate-slideDown mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <div className="flex-1">
          <p className="mb-1 text-sm font-semibold text-red-800">Error</p>
          <p className="text-sm leading-relaxed text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-700 underline transition-colors hover:text-red-900"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
