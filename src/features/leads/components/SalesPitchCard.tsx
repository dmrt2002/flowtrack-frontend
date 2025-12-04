/**
 * Sales Pitch Card Component
 *
 * Displays AI-generated sales intelligence for a lead
 * Zero-cost local LLM pitch generation
 */

'use client';

import { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Download,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useSalesPitch, useRegeneratePitch } from '../hooks/use-sales-pitch';
import { exportPitchToPDF } from '../utils/export-pitch-pdf';

interface SalesPitchCardProps {
  leadId: string;
  leadName?: string;
  companyName?: string;
}

export function SalesPitchCard({
  leadId,
  leadName,
  companyName,
}: SalesPitchCardProps) {
  const { data: pitch, isLoading, error, refetch } = useSalesPitch(leadId);
  const regenerateMutation = useRegeneratePitch();
  const [expandedSections, setExpandedSections] = useState({
    talking: true,
    pain: true,
    starters: false,
  });

  const toggleSection = (section: 'talking' | 'pain' | 'starters') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRegenerate = async () => {
    await regenerateMutation.mutateAsync(leadId);
    refetch();
  };

  const handleExportPDF = () => {
    if (!pitch) return;

    try {
      exportPitchToPDF(pitch, {
        leadName,
        companyName,
        showBranding: true,
      });
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Generating AI Sales Brief...
          </h3>
        </div>
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded bg-neutral-100" />
          <div className="h-24 animate-pulse rounded bg-neutral-100" />
          <div className="h-20 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorData = (error as any)?.response?.data;
    const isOllamaDown = errorData?.code === 'OLLAMA_UNAVAILABLE';

    return (
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600" />
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold text-orange-900">
              {isOllamaDown ? 'AI Service Offline' : 'Unable to Generate Pitch'}
            </h3>
            <p className="mb-3 text-xs text-orange-700">
              {isOllamaDown
                ? 'The AI pitch generator (Ollama) is not running. Please start Ollama to generate pitches.'
                : errorData?.message ||
                  'An error occurred while generating the sales pitch.'}
            </p>
            {!isOllamaDown && (
              <button
                onClick={() => refetch()}
                className="text-xs font-medium text-orange-700 hover:text-orange-800 hover:underline"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No pitch available
  if (!pitch) {
    return null;
  }

  // Get relevance color
  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="rounded-xl border border-l-4 border-neutral-200 border-l-indigo-500 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-neutral-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                AI Sales Brief
              </h3>
              <p className="text-xs text-neutral-500">
                Generated {formatDistanceToNow(new Date(pitch.generatedAt))} ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${getRelevanceColor(pitch.relevanceScore)}`}
            >
              {pitch.relevanceScore}% Match
            </div>
            <button
              onClick={handleExportPDF}
              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              title="Export to PDF"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regenerateMutation.isPending}
              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
              title="Regenerate pitch"
            >
              {regenerateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Executive Summary */}
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-3">
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
            <p className="text-xs leading-relaxed text-indigo-900">
              {pitch.summary}
            </p>
          </div>
        </div>

        {/* Common Ground */}
        {pitch.commonGround.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <h4 className="text-xs font-semibold text-neutral-700">
                Common Ground
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pitch.commonGround.map((item, i) => (
                <span
                  key={i}
                  className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Talking Points */}
        <div>
          <button
            onClick={() => toggleSection('talking')}
            className="mb-2 flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
              <h4 className="text-xs font-semibold text-neutral-700">
                Key Talking Points ({pitch.talkingPoints.length})
              </h4>
            </div>
            {expandedSections.talking ? (
              <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </button>
          {expandedSections.talking && (
            <ul className="space-y-1.5">
              {pitch.talkingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 flex h-1 w-1 flex-shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-neutral-600">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pain Points */}
        <div>
          <button
            onClick={() => toggleSection('pain')}
            className="mb-2 flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
              <h4 className="text-xs font-semibold text-neutral-700">
                Likely Pain Points ({pitch.painPoints.length})
              </h4>
            </div>
            {expandedSections.pain ? (
              <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </button>
          {expandedSections.pain && (
            <ul className="space-y-1.5">
              {pitch.painPoints.map((pain, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 flex h-1 w-1 flex-shrink-0 rounded-full bg-orange-600" />
                  <span className="text-neutral-600">{pain}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Value Proposition */}
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-indigo-600" />
            <h4 className="text-xs font-semibold text-indigo-900">
              Your Value Proposition
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-indigo-700">
            {pitch.valueProposition}
          </p>
        </div>

        {/* Conversation Starters */}
        <div>
          <button
            onClick={() => toggleSection('starters')}
            className="mb-2 flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-purple-600" />
              <h4 className="text-xs font-semibold text-neutral-700">
                Conversation Starters ({pitch.conversationStarters.length})
              </h4>
            </div>
            {expandedSections.starters ? (
              <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </button>
          {expandedSections.starters && (
            <ul className="space-y-1.5">
              {pitch.conversationStarters.map((starter, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 flex h-1 w-1 flex-shrink-0 rounded-full bg-purple-600" />
                  <span className="text-neutral-600">{starter}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Competitor Context */}
        {pitch.competitorContext && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
              <h4 className="text-xs font-semibold text-yellow-900">
                Competitor Context
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-yellow-700">
              {pitch.competitorContext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
