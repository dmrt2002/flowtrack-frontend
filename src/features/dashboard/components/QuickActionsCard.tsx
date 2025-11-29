'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuickActionsCardProps {
  publicFormUrl?: string;
}

export function QuickActionsCard({ publicFormUrl }: QuickActionsCardProps) {
  const [copied, setCopied] = useState(false);

  if (!publicFormUrl) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicFormUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleVisitForm = () => {
    window.open(publicFormUrl, '_blank');
  };

  // Format URL for display (remove protocol, truncate if needed)
  const displayUrl = publicFormUrl.replace(/^https?:\/\//, '');
  const truncatedUrl =
    displayUrl.length > 50 ? `${displayUrl.substring(0, 47)}...` : displayUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="mt-10 rounded-2xl border-[1.5px] border-neutral-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
          <Link2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">
            Your Public Form Link
          </h3>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            Share this link to start receiving leads
          </p>
        </div>
      </div>

      {/* URL Display */}
      <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <code className="block overflow-hidden font-mono text-sm font-medium text-ellipsis whitespace-nowrap text-neutral-900">
          {truncatedUrl}
        </code>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleCopyLink}
          disabled={copied}
          className={`h-11 flex-1 font-semibold transition-all ${
            copied
              ? 'bg-emerald-500 hover:bg-emerald-500'
              : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)]'
          }`}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 text-white"
              >
                <Check className="h-[18px] w-[18px]" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 text-white"
              >
                <Copy className="h-[18px] w-[18px]" />
                Copy Link
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          onClick={handleVisitForm}
          variant="outline"
          className="h-11 w-11 border-[1.5px] border-neutral-200 p-0 transition-all hover:border-indigo-600 hover:bg-indigo-50"
        >
          <ExternalLink className="h-5 w-5 text-neutral-600" />
        </Button>
      </div>
    </motion.div>
  );
}
