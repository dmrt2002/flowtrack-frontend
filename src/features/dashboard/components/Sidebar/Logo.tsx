import { motion } from 'framer-motion';
import Link from 'next/link';

interface LogoProps {
  collapsed: boolean;
}

export function Logo({ collapsed }: LogoProps) {
  return (
    <Link href="/dashboard-home" className="flex items-center gap-3">
      <motion.div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </motion.div>
      <motion.span
        className="text-[15px] font-semibold text-neutral-900"
        initial={false}
        animate={{
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        FlowTrack
      </motion.span>
    </Link>
  );
}
