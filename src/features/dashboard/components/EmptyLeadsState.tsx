'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface EmptyLeadsStateProps {
  publicFormUrl?: string;
}

export function EmptyLeadsState({ publicFormUrl }: EmptyLeadsStateProps) {
  const handleCopyLink = async () => {
    if (!publicFormUrl) {
      toast.error('Form link not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(publicFormUrl);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="rounded-2xl border-[1.5px] border-neutral-200 bg-white p-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Illustration */}
      <div className="mb-6 text-6xl opacity-60">📭</div>

      {/* Heading */}
      <h3 className="mb-3 text-2xl font-semibold text-neutral-900">
        No leads yet
      </h3>

      {/* Description */}
      <p className="mx-auto mb-6 max-w-md text-[15px] leading-relaxed text-neutral-500">
        Share your form link to start receiving qualified leads automatically.
      </p>

      {/* CTA Button */}
      {publicFormUrl && (
        <Button
          onClick={handleCopyLink}
          className="bg-gradient-to-br from-[#4F46E5] to-[#7c3aed] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Form Link
        </Button>
      )}
    </div>
  );
}
