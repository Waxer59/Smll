import { AuthCardLayout } from '@/layouts/auth-card-layout';
import { Anchor, Button, PasswordInput, TextInput } from '@mantine/core';
import { AtSign } from 'lucide-react';
import Link from 'next/link';

export const RegisterCard = () => {
  return (
    <AuthCardLayout title="Register">
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
        <Button type="submit" variant="light" color="gray" radius="md">
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
