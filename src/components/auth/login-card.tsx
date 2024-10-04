'use client';

import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core';
import { AtSign, Github, Mail } from 'lucide-react';
import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { LoginAlternativeButton } from './login-alternative-button';
import { useEffect, useState } from 'react';
import { account } from '@/lib/client/appwrite';
import { OAuthProvider } from 'appwrite';
import { useRouter } from 'next/navigation';
import {
  createMFAChallenge,
  loginUser
} from '@/lib/server/appwrite-functions/auth';
import { MfaVerification } from './mfa-verification';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const LoginCard = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGithubLoginLoading, setIsGithubLoginLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const mfa = url.searchParams.get('mfa');

    const startMFAChallenge = async () => {
      const challengeId = await createMFAChallenge();

      if (!challengeId) {
        toast.error('Failed to create MFA challenge.');
        setIsLoginLoading(false);
        return;
      }

      setMfaChallengeId(challengeId);
      setRequiresMfa(true);
    };

    if (mfa === 'true') {
      startMFAChallenge();
    }
  }, []);

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
    <>
      {requiresMfa ? (
        <MfaVerification challengeId={mfaChallengeId} />
      ) : (
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
              disabled={isLoginLoading || isGithubLoginLoading}>
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
            <Link
              href="/magic-link"
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors p-3 rounded-md w-full font-semibold">
              <Mail /> Magic link
            </Link>
          </div>
        </AuthCardLayout>
      )}
    </>
  );
};
