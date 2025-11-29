import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export const ConditionNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-yellow-500"
      />

      {/* YES handle (left side) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="!h-3 !w-3 !border-2 !border-white !bg-green-500"
        style={{ left: '30%' }}
      />

      {/* NO handle (right side) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!h-3 !w-3 !border-2 !border-white !bg-red-500"
        style={{ left: '70%' }}
      />

      <div className="w-[280px] rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 px-5 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-[300px] sm:px-6 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-500 text-white shadow-md sm:h-12 sm:w-12">
            <GitBranch className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold tracking-wide text-yellow-900 uppercase sm:text-sm">
              Condition
            </p>
            <p className="text-sm leading-tight font-bold text-yellow-700 sm:text-base">
              {data.label}
            </p>
          </div>
        </div>
        {data.description && (
          <p className="mt-3 text-xs leading-relaxed text-yellow-600 sm:text-sm">
            {data.description}
          </p>
        )}

        {/* Branch Labels */}
        <div className="mt-4 flex items-center justify-between border-t border-yellow-200 pt-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 sm:h-2.5 sm:w-2.5"></div>
            <span className="text-xs font-semibold text-green-700 sm:text-sm">
              YES
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 sm:h-2.5 sm:w-2.5"></div>
            <span className="text-xs font-semibold text-red-700 sm:text-sm">
              NO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';
