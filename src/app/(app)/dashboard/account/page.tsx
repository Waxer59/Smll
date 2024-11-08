import { IntegrationsSettingsCard } from '@/components/settings/integrations-settings-card';
import { ProfileSettingsCard } from '@/components/settings/profile-settings-card';
import { SecuritySettingsCard } from '@/components/settings/security-settings-card';
import { Tooltip } from '@mantine/core';
import { Puzzle } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 items-center max-w-96 mx-auto relative">
      <ProfileSettingsCard />
      <SecuritySettingsCard />
      <IntegrationsSettingsCard />
      <Tooltip label="Documentation" color="gray">
        <Link
          href="https://docs.smll.app"
          className="fixed bottom-12 right-12 bg-zinc-800 p-4 rounded-full">
          <Puzzle size={24} />
        </Link>
      </Tooltip>
    </div>
  );
}
