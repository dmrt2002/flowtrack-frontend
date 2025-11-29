import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CircleCheck, CircleX } from 'lucide-react';

export const EndNode = memo(({ data }: NodeProps) => {
  const isSuccess = data.label?.toLowerCase().includes('converted');

  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-neutral-500"
      />

      <div
        className={`w-[240px] rounded-xl border-2 px-5 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-[260px] sm:px-6 sm:py-5 ${
          isSuccess
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100'
            : 'border-neutral-400 bg-gradient-to-br from-neutral-50 to-neutral-100'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md sm:h-12 sm:w-12 ${
              isSuccess
                ? 'bg-green-500 text-white'
                : 'bg-neutral-500 text-white'
            }`}
          >
            {isSuccess ? (
              <CircleCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <CircleX className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`mb-1 text-xs font-semibold tracking-wide uppercase sm:text-sm ${
                isSuccess ? 'text-green-900' : 'text-neutral-900'
              }`}
            >
              End
            </p>
            <p
              className={`text-sm leading-tight font-bold sm:text-base ${
                isSuccess ? 'text-green-700' : 'text-neutral-700'
              }`}
            >
              {data.label}
            </p>
          </div>
        </div>
        {data.description && (
          <p
            className={`mt-3 text-xs leading-relaxed sm:text-sm ${
              isSuccess ? 'text-green-600' : 'text-neutral-600'
            }`}
          >
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';
