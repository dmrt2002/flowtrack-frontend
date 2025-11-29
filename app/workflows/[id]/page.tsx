'use client';

import { use } from 'react';
import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { WorkflowBuilderScreen } from '@/features/workflows/screens/WorkflowBuilderScreen';

export default function WorkflowBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RoleGuard>
      <WorkflowBuilderScreen workflowId={id} />
    </RoleGuard>
  );
}
