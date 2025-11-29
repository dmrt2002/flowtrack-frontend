'use client';

import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { LeadsListScreen } from '@/features/leads/screens/LeadsListScreen';

export default function LeadsPage() {
  return (
    <RoleGuard>
      <LeadsListScreen />
    </RoleGuard>
  );
}
