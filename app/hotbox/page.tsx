'use client';

import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import HotboxScreen from '@/features/hotbox/screens/HotboxScreen';

export default function HotboxPage() {
  return (
    <RoleGuard>
      <HotboxScreen />
    </RoleGuard>
  );
}
