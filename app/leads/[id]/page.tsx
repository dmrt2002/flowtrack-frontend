'use client';

import { use } from 'react';
import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { LeadDetailScreen } from '@/features/leads/screens/LeadDetailScreen';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <RoleGuard>
      <LeadDetailScreen leadId={id} />
    </RoleGuard>
  );
}
