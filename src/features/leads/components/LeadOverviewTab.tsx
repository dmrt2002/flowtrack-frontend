'use client';

import type { LeadDetailResponse } from '../types/lead';
import { CompanyIntelligenceCard } from './enrichment/CompanyIntelligenceCard';
import { TechStackCard } from './enrichment/TechStackCard';
import { PersonIntelligenceCard } from './enrichment/PersonIntelligenceCard';
import { EmailIntelligenceCard } from './enrichment/EmailIntelligenceCard';
import { DnsInfrastructureCard } from './enrichment/DnsInfrastructureCard';
import { WebsiteMetadataCard } from './enrichment/WebsiteMetadataCard';

interface LeadOverviewTabProps {
  lead: LeadDetailResponse;
  enrichmentOnly?: boolean;
}

export function LeadOverviewTab({
  lead,
  enrichmentOnly = false,
}: LeadOverviewTabProps) {
  if (enrichmentOnly) {
    // Enrichment Tab - Show all enrichment data
    return (
      <div className="space-y-4">
        {/* Company Intelligence */}
        {lead.enrichmentData?.company && (
          <CompanyIntelligenceCard company={lead.enrichmentData.company} />
        )}

        {/* Tech Stack */}
        {lead.enrichmentData?.company?.techStack &&
          lead.enrichmentData.company.techStack.length > 0 && (
            <TechStackCard
              techStack={lead.enrichmentData.company.techStack}
              techStackDetailed={lead.enrichmentData.company.techStackDetailed}
            />
          )}

        {/* Person Intelligence */}
        {lead.enrichmentData?.person && (
          <PersonIntelligenceCard person={lead.enrichmentData.person} />
        )}

        {/* Email Intelligence */}
        {lead.enrichmentData?.email && (
          <EmailIntelligenceCard email={lead.enrichmentData.email} />
        )}

        {/* DNS & Infrastructure */}
        {lead.enrichmentData?.rawData?.dns && (
          <DnsInfrastructureCard dns={lead.enrichmentData.rawData.dns} />
        )}

        {/* Website Metadata */}
        {lead.enrichmentData?.rawData?.website && (
          <WebsiteMetadataCard website={lead.enrichmentData.rawData.website} />
        )}

        {!lead.enrichmentData && (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-sm text-neutral-500">
              No enrichment data available for this lead.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Overview Tab - focus on company context + insights
  return (
    <div className="space-y-4">
      {/* Company Intelligence Summary */}
      {lead.enrichmentData?.company && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">
            Company Overview
          </h3>
          {lead.enrichmentData.company.description && (
            <p className="mb-3 text-sm leading-relaxed text-neutral-700">
              {lead.enrichmentData.company.description}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            {lead.enrichmentData.company.industry && (
              <div>
                <span className="block text-xs text-neutral-500">Industry</span>
                <span className="font-medium text-neutral-900">
                  {lead.enrichmentData.company.industry}
                </span>
              </div>
            )}
            {lead.enrichmentData.company.size && (
              <div>
                <span className="block text-xs text-neutral-500">Size</span>
                <span className="font-medium text-neutral-900">
                  {lead.enrichmentData.company.size}
                </span>
              </div>
            )}
            {lead.enrichmentData.company.location && (
              <div>
                <span className="block text-xs text-neutral-500">Location</span>
                <span className="font-medium text-neutral-900">
                  {lead.enrichmentData.company.location}
                </span>
              </div>
            )}
            {lead.enrichmentData.company.techStack && (
              <div>
                <span className="block text-xs text-neutral-500">
                  Technologies
                </span>
                <span className="font-medium text-neutral-900">
                  {lead.enrichmentData.company.techStack.length} detected
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights Placeholder */}
      <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
            <span className="text-xl">✨</span>
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold text-neutral-900">
              AI Sales Insights
            </h3>
            <p className="text-xs text-neutral-600">
              Coming soon: Intelligent insights analyzing this lead&apos;s tech
              stack, company data, and behavior to provide actionable talking
              points and recommended approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
