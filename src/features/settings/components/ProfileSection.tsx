import { PersonalInformationCard } from './PersonalInformationCard';
import { PasswordSecurityCard } from './PasswordSecurityCard';
import { ConnectedAccountsCard } from './ConnectedAccountsCard';
import { DangerZoneCard } from './DangerZoneCard';
import { useUserProfileQuery } from '../hooks';

export function ProfileSection() {
  const { data: profile, isLoading } = useUserProfileQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PersonalInformationCard profile={profile} />
      <PasswordSecurityCard />
      <ConnectedAccountsCard />
      <DangerZoneCard userEmail={profile.email} />
    </div>
  );
}
