'use client';

import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

interface SidebarToggleProps {
  collapsed: boolean;
}

export function SidebarToggle({ collapsed }: SidebarToggleProps) {
  const { toggle } = useSidebarStore();

  return (
    <motion.button
      onClick={toggle}
      className="rounded-lg p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelLeftClose className="h-5 w-5" />
      )}
    </motion.button>
  );
}
