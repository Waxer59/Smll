'use client';

import { sendVerificationEmail } from '@/lib/server/appwrite-functions/auth';
/* eslint-disable react/no-unescaped-entities */
import { useAccountStore } from '@/store/account';
import { Button, Modal } from '@mantine/core';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export const EmailVerification = () => {
  const hasEmailVerification = useAccountStore(
    (state) => state.hasEmailVerification
  );

  const handleResendEmail = () => {
    toast.success('Verification email sent.');
    sendVerificationEmail();
  };

  return (
    <Modal
      opened={!hasEmailVerification}
      onClose={() => {}}
      withCloseButton={false}>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Email Verification</h2>
          <p>
            Please check your email to verify your account, or click the button
            below to resend the verification email.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            leftSection={<Mail />}
            onClick={handleResendEmail}
            color="gray"
            variant="light"
            radius="md"
            size="md">
            Resend Email
          </Button>
        </div>
      </div>
    </Modal>
  );
};
