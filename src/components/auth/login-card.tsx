import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core';
import { AtSign, Github, Mail, User } from 'lucide-react';
import { LoginAlternativeAnchor } from './login-alternative-anchor';
import { AuthCardLayout } from '@/layouts/auth-card-layout';
import Link from 'next/link';

export const LoginCard = () => {
  return (
    <AuthCardLayout title="Login">
      <form className="flex flex-col gap-8 text-lg mt-4">
        <TextInput
          label="E-mail"
          placeholder="shortlinks@smll.app"
          type="email"
          leftSection={<AtSign width={18} />}
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          size="md"
          radius="md"
          required
          withAsterisk={false}
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" variant="light" color="gray" radius="md">
            Login
          </Button>
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
      </form>
      <div className="flex flex-col justify-center items-center gap-4 text-sm mt-8">
        <LoginAlternativeAnchor href="#">
          <User /> Continue as guest
        </LoginAlternativeAnchor>
        <LoginAlternativeAnchor href="#">
          <Github /> Log in with GitHub
        </LoginAlternativeAnchor>
        <LoginAlternativeAnchor href="/magic-link">
          <Mail /> Magic link
        </LoginAlternativeAnchor>
      </div>
    </AuthCardLayout>
  );
};
