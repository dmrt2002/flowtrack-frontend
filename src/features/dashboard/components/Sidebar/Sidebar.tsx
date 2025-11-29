'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { Logo } from './Logo';
import { SidebarNav } from './SidebarNav';
import { SidebarToggle } from './SidebarToggle';

export function Sidebar() {
  const { isCollapsed } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 64 },
  };

  const shouldExpand = !isCollapsed || isHovered;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={shouldExpand ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r-[1.5px] border-neutral-200 bg-white"
    >
      <div className="flex items-center justify-between border-b-[1.5px] border-neutral-200 px-5 py-6">
        <Logo collapsed={isCollapsed && !isHovered} />
        <SidebarToggle collapsed={isCollapsed && !isHovered} />
      </div>
      <SidebarNav collapsed={isCollapsed && !isHovered} />
    </motion.aside>
  );
}
