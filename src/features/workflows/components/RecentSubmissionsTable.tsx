import type { RecentSubmission } from '../types/analytics';
import { formatDistanceToNow } from 'date-fns';

interface RecentSubmissionsTableProps {
  submissions: RecentSubmission[];
}

export function RecentSubmissionsTable({
  submissions,
}: RecentSubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          Recent Submissions
        </h3>
        <div className="flex h-[200px] items-center justify-center text-neutral-500">
          No recent submissions
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="mb-6 text-lg font-semibold text-neutral-900">
        Recent Submissions
      </h3>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-muted-foreground border-b text-left text-sm">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 text-sm font-medium">
                    {submission.name || '-'}
                  </td>
                  <td className="text-muted-foreground py-3 text-sm">
                    {submission.email}
                  </td>
                  <td className="text-muted-foreground py-3 text-sm">
                    {submission.company || '-'}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 capitalize">
                      {submission.source === 'direct'
                        ? 'Direct'
                        : submission.source}
                    </span>
                  </td>
                  <td className="text-muted-foreground py-3 text-sm">
                    {formatDistanceToNow(new Date(submission.submittedAt), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
