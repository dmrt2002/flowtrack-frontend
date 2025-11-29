import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export const TriggerNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500"
      />

      <div className="w-[260px] rounded-xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-indigo-100 px-5 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-[280px] sm:px-6 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md sm:h-12 sm:w-12">
            <Play className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold tracking-wide text-indigo-900 uppercase sm:text-sm">
              Trigger
            </p>
            <p className="text-base leading-tight font-bold text-indigo-700 sm:text-lg">
              {data.label}
            </p>
          </div>
        </div>
        {data.description && (
          <p className="mt-3 text-xs leading-relaxed text-indigo-600 sm:text-sm">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';
