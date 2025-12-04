'use client';

import { User, CheckCircle, ExternalLink } from 'lucide-react';
import type { PersonEnrichment } from '../../types/lead';

interface PersonIntelligenceCardProps {
  person: PersonEnrichment;
}

export function PersonIntelligenceCard({
  person,
}: PersonIntelligenceCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Person Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <CheckCircle className="h-3 w-3" />
          Enriched
        </div>
      </div>

      {/* Person Photo + Name */}
      <div className="mb-5 flex items-start gap-4">
        {person.photoUrl && (
          <img
            src={person.photoUrl}
            alt={person.fullName || 'Person'}
            className="h-20 w-20 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          {person.fullName && (
            <h4 className="text-xl font-semibold text-neutral-900">
              {person.fullName}
            </h4>
          )}
          {person.jobTitle && (
            <p className="mt-1 text-base font-medium text-neutral-600">
              {person.jobTitle}
            </p>
          )}
        </div>
      </div>

      {/* Person Details */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {person.seniority && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">💼</span>
            <div>
              <div className="font-medium text-neutral-600">Seniority</div>
              <div className="text-neutral-900">{person.seniority}</div>
            </div>
          </div>
        )}

        {person.department && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-neutral-400">🏢</span>
            <div>
              <div className="font-medium text-neutral-600">Department</div>
              <div className="text-neutral-900">{person.department}</div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Links */}
      {(person.linkedinUrl || person.twitterUrl || person.githubUrl) && (
        <>
          <div className="mt-5 mb-3 text-sm font-semibold text-neutral-700">
            Professional Presence
          </div>
          <div className="flex flex-wrap gap-2">
            {person.linkedinUrl && (
              <a
                href={person.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                LinkedIn
              </a>
            )}

            {person.twitterUrl && (
              <a
                href={person.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Twitter
              </a>
            )}

            {person.githubUrl && (
              <a
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                GitHub
              </a>
            )}
          </div>
        </>
      )}

      {/* Key Insight */}
      {person.seniority && (
        <div className="border-brand-primary mt-5 rounded-lg border-l-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <div className="text-sm leading-relaxed text-neutral-700 italic">
              <strong>Key Insight:</strong> {person.seniority} suggests{' '}
              {person.seniority.toLowerCase().includes('senior')
                ? 'influence over tool purchasing decisions and budget authority.'
                : 'growing responsibility and potential for future decision-making roles.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
