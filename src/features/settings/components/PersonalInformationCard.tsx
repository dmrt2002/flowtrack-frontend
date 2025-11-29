import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateProfileMutation } from '../hooks';
import type { UserProfile } from '../types';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

interface PersonalInformationCardProps {
  profile: UserProfile;
}

export function PersonalInformationCard({
  profile,
}: PersonalInformationCardProps) {
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

  function onSubmit(data: UpdateProfileForm) {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        reset(data);
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="flex-1"
              />
              <Badge variant="success">Verified ✓</Badge>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={!isDirty}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
