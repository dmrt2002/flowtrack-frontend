'use client';

import { Building2, ExternalLink, CheckCircle } from 'lucide-react';
import type { CompanyEnrichment } from '../../types/lead';

interface CompanyIntelligenceCardProps {
  company: CompanyEnrichment;
}

export function CompanyIntelligenceCard({
  company,
}: CompanyIntelligenceCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Company Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <CheckCircle className="h-3 w-3" />
          Enriched
        </div>
      </div>

      {/* Company Logo + Name + Description */}
      <div className="mb-5">
        <div className="flex items-start gap-4">
          {company.logo && (
            <img
              src={company.logo}
              alt={company.name}
              className="h-16 w-16 rounded-lg border border-neutral-200 object-contain p-2"
            />
          )}
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-neutral-900">
              {company.name}
            </h4>
            {company.description && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {company.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Company Details Grid */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {company.domain && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">🌐</span>
            <div>
              <div className="font-medium text-neutral-600">Domain</div>
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-primary text-neutral-900"
              >
                {company.domain}
              </a>
            </div>
          </div>
        )}

        {company.industry && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">🏭</span>
            <div>
              <div className="font-medium text-neutral-600">Industry</div>
              <div className="text-neutral-900">{company.industry}</div>
            </div>
          </div>
        )}

        {company.size && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">👥</span>
            <div>
              <div className="font-medium text-neutral-600">Company Size</div>
              <div className="text-neutral-900">{company.size}</div>
            </div>
          </div>
        )}

        {company.location && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">📍</span>
            <div>
              <div className="font-medium text-neutral-600">Location</div>
              <div className="text-neutral-900">{company.location}</div>
            </div>
          </div>
        )}

        {company.founded && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">📅</span>
            <div>
              <div className="font-medium text-neutral-600">Founded</div>
              <div className="text-neutral-900">{company.founded}</div>
            </div>
          </div>
        )}

        {company.headquarters && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">🏢</span>
            <div>
              <div className="font-medium text-neutral-600">Headquarters</div>
              <div className="text-neutral-900">{company.headquarters}</div>
            </div>
          </div>
        )}
      </div>

      {/* Social Presence */}
      {(company.linkedinUrl ||
        company.twitterUrl ||
        company.facebookUrl ||
        company.website) && (
        <>
          <div className="mb-3 text-sm font-semibold text-neutral-700">
            Social Presence
          </div>
          <div className="flex flex-wrap gap-2">
            {company.linkedinUrl && (
              <a
                href={company.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                LinkedIn
              </a>
            )}

            {company.twitterUrl && (
              <a
                href={company.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Twitter
              </a>
            )}

            {company.facebookUrl && (
              <a
                href={company.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Facebook
              </a>
            )}

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        </>
      )}

      {/* Email Provider */}
      {company.emailProvider && (
        <div className="mt-5 border-t border-neutral-200 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-400">📧</span>
            <span className="font-medium text-neutral-600">
              Email Provider:
            </span>
            <span className="text-neutral-900">{company.emailProvider}</span>
          </div>
        </div>
      )}
    </div>
  );
}
