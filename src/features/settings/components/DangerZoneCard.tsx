import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { toast } from 'sonner';

interface DangerZoneCardProps {
  userEmail: string;
}

export function DangerZoneCard({ userEmail }: DangerZoneCardProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isEmailMatch = confirmEmail.toLowerCase() === userEmail.toLowerCase();

  async function handleDeleteAccount() {
    if (!isEmailMatch) return;

    setIsDeleting(true);
    try {
      await request.delete(mainUrl.deleteAccount);
      toast.success('Account deleted successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-destructive font-semibold">Delete Account</h4>
              <p className="text-muted-foreground text-sm">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>Are you absolutely sure?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm">
              This will permanently delete your account and all data associated
              with it, including:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>All workspaces you own</li>
              <li>All workflows and automations</li>
              <li>All leads and their history</li>
              <li>Team memberships</li>
            </ul>
            <p className="text-destructive text-sm font-semibold">
              This action cannot be undone.
            </p>

            <div className="space-y-2">
              <Label htmlFor="confirm-email">Type your email to confirm:</Label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="Enter your email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmEmail('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isEmailMatch || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
