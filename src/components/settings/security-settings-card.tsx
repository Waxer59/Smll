'use client';

import { resetPassword } from '@/lib/server/appwrite';
import { useAccountStore } from '@/store/account';
import { Button, Card, Tooltip } from '@mantine/core';
import { CircleX, Info, Mail, Shield, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

export const SecuritySettingsCard = () => {
  const email = useAccountStore((state) => state.email);

  const handleSendResetLink = async () => {
    await resetPassword(email);
    toast.success('Reset link sent to your email address.');
  };

  return (
    <Card
      className="flex flex-col gap-8 items-center w-full"
      radius="md"
      shadow="sm"
      withBorder>
      <h2 className="text-3xl font-bold">Security</h2>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-medium self-start">
              Multi-factor authentication
            </h3>
            <Tooltip label="Enhance your account security with MFA">
              <Info size={16} />
            </Tooltip>
          </div>
          <Button
            variant="light"
            color="gray"
            radius="md"
            size="md"
            className="w-full"
            leftSection={<Shield />}>
            Enable MFA
          </Button>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h3 className="text-base font-medium self-start">Reset password</h3>
          <Button
            variant="light"
            color="gray"
            radius="md"
            onClick={handleSendResetLink}
            size="md"
            className="w-full"
            leftSection={<Mail />}>
            Send reset link
          </Button>
        </div>
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<UserMinus />}>
          Close all sessions
        </Button>
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<CircleX />}>
          Delete account
        </Button>
      </div>
    </Card>
  );
};
