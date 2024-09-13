'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { TextInput, Button, Anchor } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const ResetPasswordCard = () => {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    if (!secret || !userId) {
      router.push('/login');
      return;
    }

    setSecret(secret);
    setUserId(userId);
  }, []);

  return (
    <AuthCardLayout title="Reset Password">
      <form className="flex flex-col gap-8 text-lg mt-4">
        <TextInput
          label="Password"
          description="Minimum 8 characters"
          placeholder="********"
          type="password"
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <TextInput
          label="Repeat Password"
          description="Minimum 8 characters"
          placeholder="********"
          type="password"
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <Button type="submit" variant="light" color="gray" radius="md">
          Send reset link
        </Button>
      </form>
      <Link href="/login" passHref legacyBehavior>
        <Anchor variant="light" c="gray" className="mt-8">
          Go back to login
        </Anchor>
      </Link>
    </AuthCardLayout>
  );
};
