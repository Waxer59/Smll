'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { resetPassword } from '@/lib/server/appwrite-functions/auth';
import { TextInput, Button, Anchor } from '@mantine/core';
import { AtSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email()
});

export const ForgotPasswordCard = () => {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setIsSending(true);
    const formData = new FormData(ev.currentTarget);

    const { error, data } = formSchema.safeParse({
      email: formData.get('email')
    });

    if (error) {
      toast.error('Please enter a valid email address.');
      setIsSending(false);
      return;
    }

    const { email } = data;

    await resetPassword(email);
    toast.success('Check your email for the reset link.');
    setIsSending(false);
    router.push('/login');
  };

  return (
    <AuthCardLayout title="Forgot Password">
      <form
        className="flex flex-col gap-8 text-lg mt-4"
        onSubmit={handleSubmit}>
        <TextInput
          label="E-mail"
          placeholder="shortlinks@smll.app"
          type="email"
          name="email"
          leftSection={<AtSign width={18} />}
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
          loading={isSending}
          disabled={isSending}>
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
