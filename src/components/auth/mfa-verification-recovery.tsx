'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { TextInput, Button } from '@mantine/core';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const MfaVerificationRecovery = () => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    console.log(code);
  };

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
