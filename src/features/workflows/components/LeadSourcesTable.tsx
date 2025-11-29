import type { LeadSourceBreakdown } from '../types/analytics';

interface LeadSourcesTableProps {
  sources: LeadSourceBreakdown[];
}

export function LeadSourcesTable({ sources }: LeadSourcesTableProps) {
  if (sources.length === 0) {
    return (
      <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          Top Lead Sources
        </h3>
        <div className="flex h-[200px] items-center justify-center text-neutral-500">
          No lead sources data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="mb-6 text-lg font-semibold text-neutral-900">
        Top Lead Sources
      </h3>
      <div>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.source} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">
                  {source.source === 'direct' ? 'Direct' : source.source}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{source.count}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
