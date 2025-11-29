'use client';

import { motion } from 'framer-motion';

interface MetricsRowProps {
  children: React.ReactNode;
}

export function MetricsRow({ children }: MetricsRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mb-6 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 lg:mb-10 lg:grid-cols-4 lg:gap-6"
    >
      {children}
    </motion.div>
  );
}
