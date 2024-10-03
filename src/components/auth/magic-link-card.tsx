'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { TextInput, Button, Anchor } from '@mantine/core';
import { AtSign, CircleCheck } from 'lucide-react';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { loginWithMagicLink } from '@/lib/server/appwrite-functions/auth';

const formSchema = z.object({
  email: z.string().email()
});

export const MagicLinkCard = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error, data } = formSchema.safeParse({
      email: formData.get('email')
    });

    if (error) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const { email } = data;
    setEmail(email);

    const token = await loginWithMagicLink(email);

    if (!token) {
      toast.error('Failed to send magic link.');
      return;
    }

    setHasSubmitted(true);
    toast.success('Magic link sent to your email address.');
  };

  return (
    <AuthCardLayout title="Magic Link">
      {hasSubmitted ? (
        <div className="flex flex-col gap-4 justify-center items-center mt-8">
          <CircleCheck size={72} className="stroke-1" />
          <p className="text-lg text-pretty text-center">
            Email sent to <strong>{email}</strong>, check your inbox.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-8 text-lg mt-4"
          onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            name="email"
            placeholder="shortlinks@smll.app"
            type="email"
            autoComplete="email"
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
            loading={hasSubmitted}
            disabled={hasSubmitted}>
            Send magic link
          </Button>
        </form>
      )}

      <Link href="/login" passHref legacyBehavior>
        <Anchor variant="light" c="gray" className="mt-8">
          Go back to login
        </Anchor>
      </Link>
    </AuthCardLayout>
  );
};
