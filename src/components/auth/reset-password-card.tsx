'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { Button, Anchor, PasswordInput } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { account } from '@/lib/client/appwrite';

const formSchema = z.object({
  password: z.string().min(8),
  repeatPassword: z.string().min(8)
});

export const ResetPasswordCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const secret = searchParams.get('secret');
    const userId = searchParams.get('userId');

    if (!secret || !userId) {
      router.push('/login');
      return;
    }

    setSecret(secret);
    setUserId(userId);
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsResetPasswordLoading(true);

    const formData = new FormData(e.currentTarget);

    const { error, data } = formSchema.safeParse({
      password: formData.get('password'),
      repeatPassword: formData.get('repeatPassword')
    });

    if (error) {
      toast.error('Please enter a valid password.');
      setIsResetPasswordLoading(false);
      return;
    }

    const { password, repeatPassword } = data;

    if (password !== repeatPassword) {
      toast.error('Passwords do not match.');
      setIsResetPasswordLoading(false);
      return;
    }

    try {
      await account.updateRecovery(userId, secret, password);
      toast.success('Password reset successfully.');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to reset password.');
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <AuthCardLayout title="Reset Password">
      <form
        className="flex flex-col gap-8 text-lg mt-4"
        onSubmit={handleSubmit}>
        <PasswordInput
          label="Password"
          description="Must be at least 8 characters, not common, and unlike the last 5 passwords."
          placeholder="********"
          name="password"
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <PasswordInput
          label="Repeat Password"
          description="Must be at least 8 characters, not common, and unlike the last 5 passwords."
          placeholder="********"
          name="repeatPassword"
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <Button
          type="submit"
          variant="light"
          color="gray"
          radius="md"
          disabled={isResetPasswordLoading}
          loading={isResetPasswordLoading}>
          Reset Password
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
