'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Activity,
  FileText,
  Building2,
  Edit,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { useLeadDetails } from '../hooks/use-leads';
import { useCurrentUser } from '@/store/currentUserStore';
import { LeadDetailHero } from '../components/LeadDetailHero';
import { LeadDetailSidebar } from '../components/LeadDetailSidebar';
import { LeadOverviewTab } from '../components/LeadOverviewTab';
import { LeadActivityTimeline } from '../components/LeadActivityTimeline';
import { LeadEmailsTab } from '../components/LeadEmailsTab';

interface LeadDetailScreenProps {
  leadId: string;
}

type TabType = 'overview' | 'activity' | 'emails' | 'enrichment';

export function LeadDetailScreen({ leadId }: LeadDetailScreenProps) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const workspaceId = currentUser?.workspaces?.[0]?.id || null;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: lead, isLoading, error } = useLeadDetails(workspaceId, leadId);

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: FileText },
    { id: 'enrichment' as TabType, label: 'Enrichment', icon: Building2 },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'emails' as TabType, label: 'Emails', icon: Mail },
  ];

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-8 w-64 rounded bg-neutral-200" />
            <div className="h-4 w-96 rounded bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-6">
                <div className="h-32 rounded bg-neutral-200" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-6">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 rounded bg-neutral-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !lead) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to Load Lead
          </h2>
          <p className="mt-2 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : 'Lead not found or you do not have permission to view it.'}
          </p>
          <button
            onClick={() => router.push('/leads')}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Return to Leads
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Ultra-Compact Header */}
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => router.push('/leads')}
            className="-ml-1.5 rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            {lead.name || 'Unknown Lead'}
          </h1>
        </div>

        {/* Hero Card + Quick Actions Bar */}
        <div className="space-y-4">
          {/* Lead Info Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <LeadDetailHero lead={lead} />
          </div>

          {/* Action Buttons + Enrichment Status */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Quick Actions - Horizontal */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-2">
                <button
                  className="hover:border-brand-primary hover:text-brand-primary flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  <Edit className="h-4 w-4" />
                  Edit Lead
                </button>
                <button
                  className="hover:border-brand-primary hover:text-brand-primary flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
                <button
                  className="hover:border-brand-primary hover:text-brand-primary flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  <Calendar className="h-4 w-4" />
                  Book Meeting
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-600"
                  onClick={() => {}}
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Won
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {}}
                >
                  <XCircle className="h-4 w-4" />
                  Mark as Lost
                </button>
              </div>
            </div>

            {/* Enrichment Status - Compact Card */}
            <div className="lg:col-span-4">
              <LeadDetailSidebar
                lead={lead}
                workspaceId={workspaceId!}
                enrichmentOnly
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="-mb-px flex gap-1 border-b border-neutral-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'overview' && <LeadOverviewTab lead={lead} />}

          {activeTab === 'enrichment' && (
            <LeadOverviewTab lead={lead} enrichmentOnly />
          )}

          {activeTab === 'activity' && (
            <LeadActivityTimeline
              events={lead.events || []}
              bookings={lead.bookings || []}
              leadId={lead.id}
              workspaceId={workspaceId!}
            />
          )}

          {activeTab === 'emails' && (
            <LeadEmailsTab workspaceId={workspaceId!} leadId={lead.id} />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
