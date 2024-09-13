'use client';

import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core';
import { AtSign } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { registerUser } from '@/lib/server/appwrite';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const RegisterCard = () => {
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setIsRegisterLoading(true);
    const formData = new FormData(ev.currentTarget);

    const { error, data } = formSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (error) {
      toast.error('Please enter a valid email address and password.');
      setIsRegisterLoading(false);
      return;
    }

    const { email, password } = data;

    const user = await registerUser(email, password);

    if (!user) {
      toast.error('Error creating account, please try again.');
      setIsRegisterLoading(false);
      return;
    }

    setIsRegisterLoading(false);
    toast.success('Account created successfully.');
    router.push('/login');
  };

  return (
    <AuthCardLayout title="Register">
      <form
        className="flex flex-col gap-8 text-lg mt-4"
        onSubmit={handleSubmit}>
        <TextInput
          label="E-mail"
          placeholder="shortlinks@smll.app"
          type="email"
          leftSection={<AtSign width={18} />}
          size="md"
          autoComplete="email"
          name="email"
          radius="md"
          required
          withAsterisk={false}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          name="password"
          size="md"
          description="Must be at least 8 characters long."
          radius="md"
          required
          withAsterisk={false}
        />
        <Button
          type="submit"
          variant="light"
          color="gray"
          radius="md"
          loading={isRegisterLoading}
          disabled={isRegisterLoading}>
          Register
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
