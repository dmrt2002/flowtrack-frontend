import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface TeamSectionProps {
  workspaceId: string;
}

export function TeamSection({}: TeamSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your workspace team and permissions
              </CardDescription>
            </div>
            <Button>+ Invite Member</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Team Management Coming Soon</p>
            <p className="text-sm">
              Invite and manage team members for workspace collaboration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
