'use client';

import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import { useCurrentUser } from '@/store/currentUserStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="outline" onClick={() => router.push('/login')}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {currentUser?.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {currentUser?.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {currentUser?.role}
              </div>
              <div>
                <span className="font-medium">Employee No:</span>{' '}
                {currentUser?.employeeNo}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Create Process
              </Button>
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'USER', 'MANAGER']}>
      <DashboardContent />
    </RoleGuard>
  );
}
