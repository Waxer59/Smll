import { IntegrationsSettingsCard } from '@/components/settings/integrations-settings-card';
import { ProfileSettingsCard } from '@/components/settings/profile-settings-card';
import { SecuritySettingsCard } from '@/components/settings/security-settings-card';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 items-center max-w-96 mx-auto relative">
      <ProfileSettingsCard />
      <SecuritySettingsCard />
      <IntegrationsSettingsCard />
    </div>
  );
}
