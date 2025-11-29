'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Code2, Globe, Braces } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceSlug: string;
  workflowId?: string;
}

type EmbedMethod = 'iframe' | 'script' | 'api';

export function EmbedCodeModal({
  isOpen,
  onClose,
  workspaceSlug,
}: EmbedCodeModalProps) {
  const [activeTab, setActiveTab] = useState<EmbedMethod>('script');
  const [copied, setCopied] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://app.flowtrack.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.flowtrack.com';
  const publicFormUrl = `${baseUrl}/p/${workspaceSlug}`;

  // Generate embed codes
  const iframeCode = `<iframe
  src="${publicFormUrl}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="no"
  title="FlowTrack Form">
</iframe>`;

  const scriptCode = `<!-- FlowTrack Form Embed -->
<div data-flowtrack-form="${workspaceSlug}"></div>
<script src="${baseUrl}/embed/flowtrack-embed.js" async></script>`;

  const apiCode = `// JavaScript / Fetch API
fetch('${apiUrl}/api/v1/forms/public/${workspaceSlug}/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fields: {
      email: 'user@example.com',
      name: 'John Doe',
      companyName: 'Acme Inc'
      // Add other form fields here
    },
    tracking: {
      utk: 'visitor_unique_id',
      utmSource: 'website'
    }
  })
})
.then(response => response.json())
.then(data => {
  console.log('Lead created:', data.leadId);
  console.log('Message:', data.message);
})
.catch(error => {
  console.error('Error:', error);
});`;

  const handleCopy = async () => {
    const codeMap = {
      iframe: iframeCode,
      script: scriptCode,
      api: apiCode,
    };

    try {
      await navigator.clipboard.writeText(codeMap[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h2 className="text-[20px] font-semibold text-neutral-900">
              Embed Form Code
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-neutral-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200 px-6">
            <button
              onClick={() => setActiveTab('script')}
              className={`border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
                activeTab === 'script'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Script Tag (Recommended)
              </span>
            </button>
            <button
              onClick={() => setActiveTab('iframe')}
              className={`border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
                activeTab === 'iframe'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Direct Iframe
              </span>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
                activeTab === 'api'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Braces className="h-4 w-4" />
                Headless API
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
            {/* Script Tab */}
            {activeTab === 'script' && (
              <div>
                <div className="mb-4">
                  <h3 className="mb-2 text-[16px] font-semibold text-neutral-900">
                    JavaScript Widget with Auto-Resizing
                  </h3>
                  <p className="text-[14px] text-neutral-600">
                    Paste this code where you want the form to appear. The
                    iframe will automatically resize based on content.
                  </p>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-[13px] text-neutral-100">
                    <code>{scriptCode}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-1 text-[14px] font-semibold text-blue-900">
                    Features
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-[13px] text-blue-800">
                    <li>Automatic height adjustment</li>
                    <li>Mobile responsive</li>
                    <li>Visitor tracking</li>
                    <li>Custom events for submission</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Iframe Tab */}
            {activeTab === 'iframe' && (
              <div>
                <div className="mb-4">
                  <h3 className="mb-2 text-[16px] font-semibold text-neutral-900">
                    Direct Iframe Embed
                  </h3>
                  <p className="text-[14px] text-neutral-600">
                    Simple iframe embed. Set a fixed height or use JavaScript to
                    handle resizing manually.
                  </p>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-[13px] text-neutral-100">
                    <code>{iframeCode}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-1 text-[14px] font-semibold text-amber-900">
                    Note
                  </h4>
                  <p className="text-[13px] text-amber-800">
                    You may need to adjust the height manually. For automatic
                    resizing, use the Script Tag method.
                  </p>
                </div>
              </div>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
              <div>
                <div className="mb-4">
                  <h3 className="mb-2 text-[16px] font-semibold text-neutral-900">
                    Headless API Integration
                  </h3>
                  <p className="text-[14px] text-neutral-600">
                    Build your own custom UI and submit data programmatically
                    via REST API.
                  </p>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-green-100 px-2 py-1 font-mono text-[12px] font-semibold text-green-700">
                      POST
                    </span>
                    <code className="font-mono text-[13px] text-neutral-700">
                      {apiUrl}/api/v1/forms/public/{workspaceSlug}/submit
                    </code>
                  </div>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-[13px] text-neutral-100">
                    <code>{apiCode}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                    <h4 className="mb-2 text-[14px] font-semibold text-indigo-900">
                      CORS Enabled
                    </h4>
                    <p className="text-[13px] text-indigo-800">
                      This endpoint allows requests from any origin. No API key
                      required.
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <h4 className="mb-2 text-[14px] font-semibold text-neutral-900">
                      Public Form URL
                    </h4>
                    <a
                      href={publicFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[13px] break-all text-indigo-600 underline hover:text-indigo-700"
                    >
                      {publicFormUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
            >
              Close
            </button>
            <a
              href={publicFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Preview Form
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
