'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Check, Copy, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LaunchpadModalProps {
  open: boolean;
  publicFormUrl: string;
  workspaceName: string;
  strategyName: string;
  onClose: () => void;
}

export function LaunchpadModal({
  open,
  publicFormUrl,
  strategyName,
  onClose,
}: LaunchpadModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Clear auto-close timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [autoCloseTimer]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicFormUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');

      // Auto-close modal after 2 seconds
      const timer = setTimeout(() => {
        handleGoToDashboard();
      }, 2000);

      setAutoCloseTimer(timer);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleVisitPage = () => {
    window.open(publicFormUrl, '_blank');
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push('/dashboard-home');
  };

  // Format URL for display (remove protocol, truncate if needed)
  const displayUrl = publicFormUrl.replace(/^https?:\/\//, '');
  const truncatedUrl =
    displayUrl.length > 50 ? `${displayUrl.substring(0, 47)}...` : displayUrl;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden border-none bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:max-w-[520px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="px-8 py-10 sm:px-10 sm:py-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
            >
              <Rocket className="h-10 w-10 text-white" />
            </motion.div>
          </motion.div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-[28px] leading-tight font-bold tracking-tight text-neutral-900">
              Your System is Live!
            </h2>
            <p className="mx-auto max-w-[420px] text-[15px] leading-relaxed text-neutral-700">
              The {strategyName} strategy is active. Leads will now be
              automatically filtered and responded to based on your
              configuration.
            </p>
          </div>

          {/* Link Card */}
          <div className="mb-6 rounded-xl border-[1.5px] border-neutral-200 bg-neutral-50 p-5 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-[0_4px_12px_rgba(79,70,229,0.08)]">
            <div className="mb-2">
              <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                Your Form Link
              </span>
            </div>

            {/* URL Display */}
            <div className="mb-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
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
                    ? 'bg-[#10B981] hover:bg-[#10B981]'
                    : 'bg-[#4F46E5] hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
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
                onClick={handleVisitPage}
                variant="outline"
                className="h-11 w-11 border-[1.5px] border-neutral-200 p-0 transition-all hover:border-[#4F46E5] hover:bg-indigo-50"
              >
                <ExternalLink className="h-5 w-5 text-neutral-600" />
              </Button>
            </div>
          </div>

          {/* Share Hints */}
          {/* Command Center CTA */}
          <Button
            onClick={handleGoToDashboard}
            className="h-12 w-full bg-gradient-to-r from-[#4F46E5] to-[#7c3aed] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
          >
            Go to Command Center →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
