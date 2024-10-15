'use client';

import { useAccountStore } from '@/store/account';
import { Button, Card, Tooltip } from '@mantine/core';
import {
  CircleX,
  Info,
  Mail,
  Shield,
  ShieldCheck,
  UserMinus
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DeleteAccountModal } from './delete-account-modal';
import { CloseAllSessionsModal } from './close-all-sessions-modal';
import {
  disableAccountMFA,
  enableAccountMFA,
  resetPassword
} from '@/lib/server/appwrite-functions/auth';
import { RecoveryCodesModal } from './recovery-codes-modal';

export const SecuritySettingsCard = () => {
  const email = useAccountStore((state) => state.email);
  const hasMFA = useAccountStore((state) => state.hasMFA);
  const isPasswordlessAccount = useAccountStore(
    (state) => state.isPasswordlessAccount
  );
  const setHasMFA = useAccountStore((state) => state.setHasMFA);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [isCloseAllSessionsOpen, setIsCloseAllSessionsOpen] = useState(false);
  const [isRecoveryCodesModalOpen, setIsRecoveryCodesModalOpen] =
    useState(false);

  const handleSendResetLink = async () => {
    await resetPassword(email);
    toast.success('Reset link sent to your email address.');
  };

  const handleToggleMFA = async () => {
    if (hasMFA) {
      await disableAccountMFA();
      toast.success('MFA disabled successfully.');
    } else {
      const recoveryCodes = await enableAccountMFA();

      setIsRecoveryCodesModalOpen(true);

      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
      }

      toast.success('MFA enabled successfully.');
    }

    setHasMFA(!hasMFA);
  };

  return (
    <Card
      className="flex flex-col gap-8 items-center w-full"
      radius="md"
      shadow="sm"
      withBorder>
      <h2 className="text-3xl font-bold">Security</h2>
      <div className="flex flex-col gap-6 w-full">
        {!isPasswordlessAccount && (
          <>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-base font-medium self-start">
                  Multi-factor authentication
                </h3>
                <Tooltip
                  label="Enhance your account security with MFA"
                  color="gray">
                  <Info size={16} />
                </Tooltip>
              </div>
              <Button
                variant="light"
                color="gray"
                radius="md"
                size="md"
                className="w-full"
                leftSection={hasMFA ? <ShieldCheck /> : <Shield />}
                onClick={handleToggleMFA}>
                {hasMFA ? 'Disable MFA' : 'Enable MFA'}
              </Button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h3 className="text-base font-medium self-start">
                Reset password
              </h3>
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
          </>
        )}
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<UserMinus />}
          onClick={() => setIsCloseAllSessionsOpen(true)}>
          Close all sessions
        </Button>
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<CircleX />}
          onClick={() => setIsDeleteAccountModalOpen(true)}>
          Delete account
        </Button>
      </div>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      />
      <CloseAllSessionsModal
        isOpen={isCloseAllSessionsOpen}
        onClose={() => setIsCloseAllSessionsOpen(false)}
      />
      <RecoveryCodesModal
        isOpen={isRecoveryCodesModalOpen && recoveryCodes.length > 0}
        onClose={() => setIsRecoveryCodesModalOpen(false)}
        recoveryCodes={recoveryCodes}
      />
    </Card>
  );
};
