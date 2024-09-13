'use client';

import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core';
import { AtSign, Github, Mail, User } from 'lucide-react';
import { LoginAlternativeAnchor } from './login-alternative-anchor';
import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { LoginAlternativeButton } from './login-alternative-button';
import { loginUser } from '@/lib/server/appwrite';
import { useState } from 'react';
import { account } from '@/lib/client/appwrite';
import { OAuthProvider } from 'appwrite';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const LoginCard = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGithubLoginLoading, setIsGithubLoginLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setIsLoginLoading(true);

    const formData = new FormData(ev.currentTarget);

    const { error, data } = formSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (error) {
      toast.error('Please enter a valid email address and password.');
      setIsLoginLoading(false);
      return;
    }

    const { email, password } = data;

    const session = await loginUser(email, password);

    if (!session) {
      toast.error('Invalid email or password.');
      setIsLoginLoading(false);
      return;
    }

    setIsLoginLoading(false);
    router.push('/dashboard');
  };

  const handleGithubLogin = async () => {
    setIsGithubLoginLoading(true);

    account.createOAuth2Token(
      OAuthProvider.Github,
      BASE_URL + '/api/create-session',
      BASE_URL
    );
  };

  return (
    <AuthCardLayout title="Login">
      <form
        className="flex flex-col gap-8 text-lg mt-4"
        onSubmit={handleSubmit}>
        <TextInput
          label="E-mail"
          placeholder="shortlinks@smll.app"
          type="email"
          autoComplete="email"
          name="email"
          leftSection={<AtSign width={18} />}
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          name="password"
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
          loading={isLoginLoading}
          disabled={isLoginLoading}>
          Login
        </Button>
      </form>
      <div className="flex flex-col gap-2 mt-2">
        <Link href="/forgot-password" passHref legacyBehavior>
          <Anchor variant="light" c="gray">
            Forgot password?
          </Anchor>
        </Link>
        <Link href="/register" passHref legacyBehavior>
          <Anchor variant="light" c="gray">
            Create account
          </Anchor>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 text-sm mt-8">
        <LoginAlternativeButton
          leftSection={<Github />}
          onClick={handleGithubLogin}
          loading={isGithubLoginLoading}
          disabled={isGithubLoginLoading}>
          Log in with GitHub
        </LoginAlternativeButton>
        <Link href="/magic-link" passHref legacyBehavior>
          <LoginAlternativeAnchor>
            <Mail /> Magic link
          </LoginAlternativeAnchor>
        </Link>
      </div>
    </AuthCardLayout>
  );
};
