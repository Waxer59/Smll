'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { verifyMFA } from '@/lib/server/appwrite-functions/auth';
import { Button, TextInput } from '@mantine/core';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  challengeId: string;
}

export const MfaVerification: React.FC<Props> = ({ challengeId }) => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    const isVerified = await verifyMFA(challengeId, code);

    if (!isVerified) {
      toast.error('Invalid code.');
      return;
    }

    toast.success('MFA verified successfully.');
    router.push('/dashboard');
  };

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
      </div>
    </AuthCardLayout>
  );
};
