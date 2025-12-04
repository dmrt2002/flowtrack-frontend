'use client';

import { FileText } from 'lucide-react';
import type { WebsiteMetadata } from '../../types/lead';

interface WebsiteMetadataCardProps {
  website: WebsiteMetadata;
}

export function WebsiteMetadataCard({ website }: WebsiteMetadataCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-5 flex items-center gap-3 border-b border-neutral-200 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900">
          Website Metadata
        </h3>
      </div>

      {/* OG Image Preview */}
      {website.ogImage && (
        <div className="mb-5">
          <img
            src={website.ogImage}
            alt="Open Graph preview"
            className="w-full rounded-lg border border-neutral-200 object-cover"
            style={{ maxHeight: '200px' }}
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Page Title */}
      {website.title && (
        <div className="mb-4">
          <div className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Page Title
          </div>
          <div className="text-base font-semibold text-neutral-900">
            {website.title}
          </div>
        </div>
      )}

      {/* Meta Description */}
      {website.description && (
        <div className="mb-4">
          <div className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Meta Description
          </div>
          <div className="text-sm leading-relaxed text-neutral-700">
            {website.description}
          </div>
        </div>
      )}

      {/* Keywords */}
      {website.keywords && website.keywords.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {website.keywords.slice(0, 10).map((keyword, index) => (
              <span
                key={index}
                className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
              >
                {keyword}
              </span>
            ))}
            {website.keywords.length > 10 && (
              <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                +{website.keywords.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Open Graph Title */}
      {website.ogTitle && website.ogTitle !== website.title && (
        <div className="mb-4">
          <div className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Open Graph Title
          </div>
          <div className="text-sm text-neutral-700">{website.ogTitle}</div>
        </div>
      )}

      {/* Open Graph Description */}
      {website.ogDescription &&
        website.ogDescription !== website.description && (
          <div className="mb-4">
            <div className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Open Graph Description
            </div>
            <div className="text-sm leading-relaxed text-neutral-700">
              {website.ogDescription}
            </div>
          </div>
        )}

      {/* Structured Data */}
      {website.structuredData && (
        <div className="mt-5 rounded-lg bg-neutral-50 p-3">
          <div className="mb-2 text-xs font-semibold text-neutral-700">
            Structured Data Detected
          </div>
          <div className="text-xs text-neutral-600">
            This website includes structured data (JSON-LD/Schema.org) which can
            improve SEO and rich snippet visibility in search results.
          </div>
        </div>
      )}
    </div>
  );
}
