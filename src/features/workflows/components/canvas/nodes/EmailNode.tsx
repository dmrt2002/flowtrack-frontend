import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, Edit3 } from 'lucide-react';

export const EmailNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
      />

      <div className="w-[280px] cursor-pointer rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-4 shadow-lg transition-all hover:scale-105 hover:border-blue-500 hover:shadow-xl sm:w-[320px] sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-md sm:h-11 sm:w-11">
              <Mail className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold tracking-wide text-blue-900 uppercase sm:text-sm">
                Email
              </p>
              <p className="mb-2 text-sm leading-tight font-bold text-blue-700 sm:text-base">
                {data.label}
              </p>
              <div className="space-y-1 sm:space-y-1.5">
                <p className="truncate text-xs font-medium text-blue-600 sm:text-sm">
                  <span className="text-blue-800">Subject:</span> {data.subject}
                </p>
                <p className="line-clamp-2 text-xs leading-relaxed text-blue-600 sm:text-sm">
                  {data.body}
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/60 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8">
            <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <div className="mt-3 border-t border-blue-200 pt-2.5">
          <p className="text-center text-[10px] font-medium tracking-wide text-blue-500 uppercase sm:text-xs">
            Click to edit template
          </p>
        </div>
      </div>
    </div>
  );
});

EmailNode.displayName = 'EmailNode';
