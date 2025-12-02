import { useState } from 'react';
import {
  useInboxEmails,
  useEmailStatistics,
  type SentEmail,
} from '../hooks/use-inbox-emails';
import { useCurrentUser } from '@/store/currentUserStore';
import { EmailDetailModal } from '../components/EmailDetailModal';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';

export function InboxScreen() {
  const { currentUser } = useCurrentUser();
  const currentWorkspace = currentUser?.workspaces?.[0];
  const [filters, setFilters] = useState({
    workflowId: undefined as string | undefined,
    emailType: undefined as 'welcome' | 'thank_you' | 'follow_up' | undefined,
    deliveryStatus: undefined as
      | 'sent'
      | 'delivered'
      | 'bounced'
      | 'failed'
      | undefined,
    openStatus: 'all' as 'opened' | 'unopened' | 'all',
    search: '',
    offset: 0,
    limit: 50,
  });
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: emailsData, isLoading } = useInboxEmails({
    workspaceId: currentWorkspace?.id || '',
    ...filters,
  });

  const { data: stats } = useEmailStatistics(currentWorkspace?.id || '');

  const handleEmailClick = (email: SentEmail) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  if (!currentWorkspace) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
            <p className="text-neutral-600">Loading workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-neutral-900">
                Inbox
              </h1>
              <p className="mt-1.5 text-[15px] text-neutral-600">
                All automated emails sent from workflows
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search emails..."
                className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 pr-10 text-sm transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, offset: 0 })
                }
              />
              <svg
                className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Tab-style Status Filters */}
          <div className="mb-4 flex gap-2">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filters.openStatus === 'all'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              onClick={() =>
                setFilters({ ...filters, openStatus: 'all', offset: 0 })
              }
            >
              All ({stats?.totalSent || 0})
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filters.openStatus === 'opened'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              onClick={() =>
                setFilters({ ...filters, openStatus: 'opened', offset: 0 })
              }
            >
              Opened ({stats?.totalOpened || 0})
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filters.openStatus === 'unopened'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              onClick={() =>
                setFilters({ ...filters, openStatus: 'unopened', offset: 0 })
              }
            >
              Unopened ({(stats?.totalSent || 0) - (stats?.totalOpened || 0)})
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="flex gap-3">
            <select
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filters.emailType || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  emailType: e.target.value as any,
                  offset: 0,
                })
              }
            >
              <option value="">All Email Types</option>
              <option value="welcome">Welcome</option>
              <option value="thank_you">Thank You</option>
              <option value="follow_up">Follow Up</option>
            </select>
          </div>
        </div>

        {/* Email List Table */}
        <div className="overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {isLoading ? (
            <div className="p-12 text-center text-neutral-500">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
              <p className="mt-4 text-neutral-600">Loading emails...</p>
            </div>
          ) : emailsData?.sentEmails && emailsData.sentEmails.length > 0 ? (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="w-10 px-4 py-3 text-center text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Sent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {emailsData.sentEmails.map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className="cursor-pointer transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-4 py-4 text-center">
                      {email.openCount > 0 ? (
                        <div
                          className="mx-auto h-2.5 w-2.5 rounded-full bg-green-500"
                          title={`Opened ${email.openCount} time${email.openCount > 1 ? 's' : ''}`}
                        ></div>
                      ) : (
                        <div
                          className="mx-auto h-2.5 w-2.5 rounded-full border-2 border-neutral-300"
                          title="Not opened"
                        ></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-neutral-900">
                        {email.lead.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {email.recipientEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate text-sm font-medium text-neutral-700">
                        {email.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-700">
                        {email.workflow.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          email.emailType === 'welcome'
                            ? 'bg-indigo-50 text-indigo-700'
                            : email.emailType === 'thank_you'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {email.emailType === 'welcome'
                          ? 'Welcome'
                          : email.emailType === 'thank_you'
                            ? 'Thank You'
                            : 'Follow Up'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-neutral-500">
                        {new Date(email.sentAt).toLocaleDateString()} at{' '}
                        {new Date(email.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
              <svg
                className="mx-auto h-16 w-16 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                No emails sent yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                Emails sent through automated workflows will appear here
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {emailsData && emailsData.totalCount > filters.limit && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  offset: Math.max(0, filters.offset - filters.limit),
                })
              }
              disabled={filters.offset === 0}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-neutral-700">
              Page {Math.floor(filters.offset / filters.limit) + 1} of{' '}
              {Math.ceil(emailsData.totalCount / filters.limit)}
            </span>
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  offset: filters.offset + filters.limit,
                })
              }
              disabled={!emailsData.hasMore}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      <EmailDetailModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </DashboardLayout>
  );
}
