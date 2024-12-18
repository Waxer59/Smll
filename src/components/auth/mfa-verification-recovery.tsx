'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import {
  createMFARecoveryChallenge,
  verifyMFA
} from '@/lib/server/appwrite-functions/auth';
import { TextInput, Button } from '@mantine/core';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

let isChallengeCreated = false;

export const MfaVerificationRecovery = () => {
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!challengeId) return;

    const isVerified = await verifyMFA(challengeId, code);

    if (!isVerified) {
      toast.error('Invalid code.');
      return;
    }

    toast.success('MFA verified successfully.');

    // I'm not using next router because currently it doesn't work with parallel routes
    // I need to force the hard-refresh to ensure the page is loaded
    // https://github.com/vercel/next.js/issues/66025
    window.location.href = '/dashboard';
  };

  useEffect(() => {
    if (isChallengeCreated) return;

    const startMFAChallenge = async () => {
      const challengeId = await createMFARecoveryChallenge();

      if (!challengeId) {
        toast.error('Failed to create MFA challenge.');
        return;
      }

      setChallengeId(challengeId);
    };

    startMFAChallenge();
    isChallengeCreated = true;
  }, []);

  return (
    <AuthCardLayout title="MFA Verification Recovery">
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
        <Link href="/mfa" className="mr-auto underline">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Return to MFA verification
        </Link>
      </div>
    </AuthCardLayout>
  );
};
