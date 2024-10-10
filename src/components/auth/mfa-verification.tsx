'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import {
  createMFAChallenge,
  logoutUser,
  verifyMFA
} from '@/lib/server/appwrite-functions/auth';
import { Button, TextInput } from '@mantine/core';
import { Check, LogOut, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

let isChallengeCreated = false;

export const MfaVerification: React.FC = () => {
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const handleResend = async () => {
    toast.success('MFA code resent!');

    startMFAChallenge();
  };

  const startMFAChallenge = useCallback(async () => {
    const challengeId = await createMFAChallenge();

    if (!challengeId) {
      toast.error('Failed to create MFA challenge.');
      return;
    }

    setChallengeId(challengeId);
  }, []);

  const handleVerify = async () => {
    if (!challengeId) return;

    const isVerified = await verifyMFA(challengeId, code);

    if (!isVerified) {
      toast.error('Invalid code.');
      return;
    }

    toast.success('MFA verified successfully.');
    router.push('/dashboard');
  };

  useEffect(() => {
    if (isChallengeCreated) return;

    startMFAChallenge();
    isChallengeCreated = true;
  }, [router, startMFAChallenge]);

  return (
    <AuthCardLayout title="MFA Verification">
      <div className="flex flex-col items-center gap-4 w-full mt-4">
        <TextInput
          label="Code"
          placeholder="******"
          description="Enter the MFA code"
          className="w-full"
          size="md"
          radius="md"
          onChange={(e) => setCode(e.target.value)}
          value={code}
          required
          withAsterisk={false}
        />
        <Button
          leftSection={<Check />}
          color="dark"
          radius="md"
          size="md"
          className="w-full"
          onClick={handleVerify}>
          Verify
        </Button>
        <Button
          leftSection={<Mail />}
          variant="subtle"
          color="gray"
          radius="md"
          size="md"
          className="w-full"
          onClick={handleResend}>
          Resend code
        </Button>
        <Link href="/mfa-recovery" className="mr-auto underline">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Don't have MFA code? Recover
        </Link>
        <Button
          color="red"
          variant="light"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<LogOut />}
          onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </AuthCardLayout>
  );
};
