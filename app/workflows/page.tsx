'use client';

import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { WorkflowsListScreen } from '@/features/workflows/screens/WorkflowsListScreen';

export default function WorkflowsPage() {
  return (
    <RoleGuard>
      <WorkflowsListScreen />
    </RoleGuard>
  );
}
