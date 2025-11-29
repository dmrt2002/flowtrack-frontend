import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock, Edit3 } from 'lucide-react';

export const DelayNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-purple-500"
      />

      <div className="w-[240px] cursor-pointer rounded-xl border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-4 shadow-lg transition-all hover:scale-105 hover:border-purple-500 hover:shadow-xl sm:w-[260px] sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white shadow-md sm:h-11 sm:w-11">
              <Clock className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-wide text-purple-900 uppercase sm:text-sm">
                Delay
              </p>
              <p className="text-sm leading-tight font-bold text-purple-700 sm:text-base">
                {data.label}
              </p>
              <p className="mt-1 text-lg font-bold text-purple-600 sm:text-xl">
                {data.delayDays} {data.delayDays === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/60 text-purple-600 opacity-0 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8">
            <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
        <div className="mt-3 border-t border-purple-200 pt-2.5">
          <p className="text-center text-[10px] font-medium tracking-wide text-purple-500 uppercase sm:text-xs">
            Click to edit duration
          </p>
        </div>
      </div>
    </div>
  );
});

DelayNode.displayName = 'DelayNode';
