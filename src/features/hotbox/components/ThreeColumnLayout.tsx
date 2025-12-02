import type { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
  leftPanel: ReactNode;
  middlePanel: ReactNode;
  rightPanel?: ReactNode;
  showLeftPanel: boolean;
  showRightPanel?: boolean;
}

export function ThreeColumnLayout({
  leftPanel,
  middlePanel,
  rightPanel,
  showLeftPanel,
  showRightPanel = false,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Lead Summary */}
      {showLeftPanel && (
        <div className="hidden h-full flex-shrink-0 lg:block">{leftPanel}</div>
      )}

      {/* Middle Panel - Conversation Thread with Reply */}
      <div className="h-full min-w-0 flex-1">{middlePanel}</div>

      {/* Right Panel - Message Details (shown when message is selected) */}
      {showRightPanel && rightPanel && (
        <div className="hidden h-full flex-shrink-0 md:block">{rightPanel}</div>
      )}
    </div>
  );
}
