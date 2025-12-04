'use client';

import { Wrench, CheckCircle } from 'lucide-react';
import type { TechStackDetails } from '../../types/lead';

interface TechStackCardProps {
  techStack: string[];
  techStackDetailed?: TechStackDetails;
}

export function TechStackCard({
  techStack,
  techStackDetailed,
}: TechStackCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Wrench className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Tech Stack Detected ({techStack.length})
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <CheckCircle className="h-3 w-3" />
          Detected
        </div>
      </div>

      {techStackDetailed ? (
        <div className="space-y-4">
          {/* CRM */}
          {techStackDetailed.crm && techStackDetailed.crm.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                CRM
              </div>
              <div className="flex flex-wrap gap-2">
                {techStackDetailed.crm.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Analytics */}
          {techStackDetailed.analytics &&
            techStackDetailed.analytics.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                  Analytics
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStackDetailed.analytics.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Marketing */}
          {techStackDetailed.marketing &&
            techStackDetailed.marketing.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                  Marketing
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStackDetailed.marketing.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg border border-pink-200 bg-pink-50 px-3 py-1.5 text-sm font-medium text-pink-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Chat/Support */}
          {techStackDetailed.chat && techStackDetailed.chat.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Chat/Support
              </div>
              <div className="flex flex-wrap gap-2">
                {techStackDetailed.chat.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* E-commerce + CMS (Platform) */}
          {((techStackDetailed.ecommerce &&
            techStackDetailed.ecommerce.length > 0) ||
            (techStackDetailed.cms && techStackDetailed.cms.length > 0)) && (
            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Platform
              </div>
              <div className="flex flex-wrap gap-2">
                {techStackDetailed.ecommerce?.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700"
                  >
                    {tech}
                  </span>
                ))}
                {techStackDetailed.cms?.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Infrastructure (CDN + Hosting) */}
          {((techStackDetailed.cdn && techStackDetailed.cdn.length > 0) ||
            (techStackDetailed.hosting &&
              techStackDetailed.hosting.length > 0)) && (
            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Infrastructure
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ...(techStackDetailed.cdn || []),
                  ...(techStackDetailed.hosting || []),
                ].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Other (Payment + Development + Other) */}
          {((techStackDetailed.payment &&
            techStackDetailed.payment.length > 0) ||
            (techStackDetailed.development &&
              techStackDetailed.development.length > 0) ||
            (techStackDetailed.other &&
              techStackDetailed.other.length > 0)) && (
            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Other
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ...(techStackDetailed.payment || []),
                  ...(techStackDetailed.development || []),
                  ...(techStackDetailed.other || []),
                ].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Fallback: Simple list if detailed data unavailable
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
