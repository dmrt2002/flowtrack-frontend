import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { ProfileSection } from './ProfileSection';
import { BillingSection } from './BillingSection';
import { TeamSection } from './TeamSection';

interface SettingsScreenProps {
  workspaceId: string;
}

type TabValue = 'profile' | 'billing' | 'team';

export function SettingsScreen({ workspaceId }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('profile');

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'profile', label: 'Profile' },
    { value: 'billing', label: 'Billing' },
    { value: 'team', label: 'Team' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[32px] lg:text-[32px]">
            Settings
          </h1>
          <p className="text-sm text-neutral-600 sm:text-[15px] lg:text-[15px]">
            Manage your account settings, billing, and team
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="-mx-4 overflow-x-auto border-b border-neutral-200 px-4 sm:mx-0 sm:px-0"
        >
          <div className="flex min-w-max gap-4 sm:min-w-0 sm:gap-6 lg:min-w-0 lg:gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative pb-3 text-sm font-medium whitespace-nowrap transition-colors sm:text-[15px] lg:text-[15px] ${
                  activeTab === tab.value
                    ? 'text-indigo-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'billing' && (
            <BillingSection workspaceId={workspaceId} />
          )}
          {activeTab === 'team' && <TeamSection workspaceId={workspaceId} />}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
