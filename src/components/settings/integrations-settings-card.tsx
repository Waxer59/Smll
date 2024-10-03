'use client';

import { createAccountToken } from '@/lib/server/appwrite-functions/account';
import { useAccountStore } from '@/store/account';
import { Button, Card } from '@mantine/core';
import { toast } from 'sonner';
import { TokenItem } from './token-item';

export const IntegrationsSettingsCard = () => {
  const tokens = useAccountStore((state) => state.tokens);
  const addToken = useAccountStore((state) => state.addToken);

  const handleCreateToken = async () => {
    const token = await createAccountToken();

    if (!token) {
      toast.error('Failed to create token.');
      return;
    }

    toast.success('Token created successfully.');
    addToken(token);
  };

  return (
    <Card
      className="flex flex-col gap-8 items-center w-full"
      radius="md"
      shadow="sm"
      withBorder>
      <h2 className="text-3xl font-bold">Integrations</h2>
      <ul className={`w-full ${tokens.length > 0 ? '' : 'hidden'}`}>
        {tokens.map(({ id, token }) => (
          <TokenItem key={id} token={token} />
        ))}
      </ul>
      <Button
        variant="light"
        color="gray"
        radius="md"
        size="md"
        className="w-full"
        onClick={handleCreateToken}>
        Create token
      </Button>
    </Card>
  );
};
