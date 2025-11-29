'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmissionSuccessProps {
  message: string;
  leadId?: string;
  redirectUrl?: string;
}

export function SubmissionSuccess({
  message,
  leadId,
  redirectUrl,
}: SubmissionSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="py-12 text-center"
    >
      {/* Success Icon with Bounce Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="mb-6 inline-block"
      >
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5] text-white" />
        </div>
      </motion.div>

      {/* Success Heading */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-3 text-[28px] font-bold tracking-tight text-neutral-900"
      >
        Success!
      </motion.h2>

      {/* Success Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mx-auto mb-6 max-w-md text-[16px] leading-relaxed text-neutral-600"
      >
        {message}
      </motion.p>

      {/* Redirect Notice */}
      {redirectUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-medium text-indigo-700">
            Redirecting...
          </span>
        </motion.div>
      )}

      {/* Reference ID */}
      {leadId && !redirectUrl && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="mt-8 font-mono text-[13px] text-neutral-400"
        >
          Reference: {leadId.substring(0, 8)}
        </motion.p>
      )}
    </motion.div>
  );
}
