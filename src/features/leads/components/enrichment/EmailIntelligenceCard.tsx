'use client';

import { Mail, CheckCircle, X, AlertTriangle } from 'lucide-react';
import type { EmailEnrichment } from '../../types/lead';

interface EmailIntelligenceCardProps {
  email: EmailEnrichment;
}

export function EmailIntelligenceCard({ email }: EmailIntelligenceCardProps) {
  // Calculate deliverability score
  const calculateScore = () => {
    let score = 0;
    if (email.isValid) score += 20;
    if (email.isDeliverable) score += 30;
    if (email.smtpVerified) score += 25;
    if (!email.isDisposable) score += 10;
    if (!email.isCatchAll) score += 10;
    if (!email.isRoleAccount) score += 5;
    return score;
  };

  const deliverabilityScore = calculateScore();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    return '🔴';
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Email Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <CheckCircle className="h-3 w-3" />
          Verified
        </div>
      </div>

      {/* Provider */}
      {email.provider && (
        <div className="mb-5">
          <div className="text-sm font-medium text-neutral-600">
            Email Provider
          </div>
          <div className="mt-1 text-base font-semibold text-neutral-900">
            {email.provider}
          </div>
        </div>
      )}

      {/* Validation Checks */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-3">
          {email.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-neutral-700">Valid Format</span>
        </div>

        <div className="flex items-center gap-3">
          {email.isDeliverable ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-neutral-700">Deliverable</span>
        </div>

        <div className="flex items-center gap-3">
          {email.smtpVerified ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-neutral-700">SMTP Verified</span>
        </div>

        <div className="flex items-center gap-3">
          {!email.isDisposable ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-neutral-700">Not Disposable</span>
        </div>

        <div className="flex items-center gap-3">
          {!email.isCatchAll ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-neutral-700">Not Catch-All</span>
        </div>

        {email.isRoleAccount && (
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-neutral-700">
              Role Account (might not be personal)
            </span>
          </div>
        )}
      </div>

      {/* MX Records */}
      {email.mxRecords && email.mxRecords.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 text-sm font-semibold text-neutral-700">
            MX Records ({email.mxRecords.length})
          </div>
          <div className="space-y-1 rounded-lg bg-neutral-50 p-3">
            {email.mxRecords.slice(0, 3).map((record, index) => (
              <div key={index} className="text-xs text-neutral-600">
                • {record}
              </div>
            ))}
            {email.mxRecords.length > 3 && (
              <div className="text-xs text-neutral-500">
                +{email.mxRecords.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deliverability Score */}
      <div className="rounded-lg bg-neutral-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-neutral-700">
              Deliverability Score
            </div>
            <div
              className={`mt-1 text-3xl font-bold ${getScoreColor(deliverabilityScore)}`}
            >
              {deliverabilityScore}/100
            </div>
          </div>
          <div className="text-4xl">{getScoreEmoji(deliverabilityScore)}</div>
        </div>
      </div>
    </div>
  );
}
