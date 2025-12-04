'use client';

import { Globe, CheckCircle } from 'lucide-react';
import type { DnsRecords } from '../../types/lead';

interface DnsInfrastructureCardProps {
  dns: DnsRecords;
}

export function DnsInfrastructureCard({ dns }: DnsInfrastructureCardProps) {
  // Calculate security score
  const calculateSecurityScore = () => {
    let score = 0;
    if (dns.spf) score += 3;
    if (dns.dmarc) score += 3;
    if (dns.dkim) score += 2;
    if (dns.mx && dns.mx.length > 0) score += 2;
    return score;
  };

  const securityScore = calculateSecurityScore();
  const maxScore = 10;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Globe className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">
            DNS & Infrastructure
          </h3>
        </div>
      </div>

      {/* SPF Record */}
      {dns.spf && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-neutral-900">
              SPF Record
            </span>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3">
            <code className="text-xs text-neutral-700">{dns.spf}</code>
          </div>
        </div>
      )}

      {/* DMARC Record */}
      {dns.dmarc && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-neutral-900">
              DMARC Record
            </span>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3">
            <code className="text-xs text-neutral-700">{dns.dmarc}</code>
          </div>
        </div>
      )}

      {/* DKIM */}
      {dns.dkim && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-neutral-900">DKIM</span>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3">
            <code className="text-xs text-neutral-700">{dns.dkim}</code>
          </div>
        </div>
      )}

      {/* MX Records */}
      {dns.mx && dns.mx.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold text-neutral-900">
            MX Records ({dns.mx.length})
          </div>
          <div className="space-y-1 rounded-lg bg-neutral-50 p-3">
            {dns.mx.map((record, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-neutral-700"
              >
                <span className="font-medium">Priority {record.priority}:</span>
                <span className="font-mono">{record.exchange}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TXT Records */}
      {dns.txt && dns.txt.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold text-neutral-900">
            TXT Records ({dns.txt.length})
          </div>
          <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-neutral-50 p-3">
            {dns.txt.map((record, index) => (
              <div key={index} className="text-xs text-neutral-700">
                • <code className="font-mono">{record}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Score */}
      <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-neutral-700">
              Security Score
            </div>
            <div className="mt-1 text-3xl font-bold text-green-600">
              {securityScore}/{maxScore}
            </div>
            <div className="mt-1 text-xs text-neutral-600">
              {securityScore === maxScore
                ? 'Excellent email authentication'
                : securityScore >= 6
                  ? 'Good email authentication'
                  : 'Basic email authentication'}
            </div>
          </div>
          <div className="text-4xl">
            {securityScore >= 8 ? '🟢' : securityScore >= 5 ? '🟡' : '🟠'}
          </div>
        </div>
      </div>
    </div>
  );
}
