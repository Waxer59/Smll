'use client';

import {
  updateName,
  updateEmail
} from '@/lib/server/appwrite-functions/account';
import { useAccountStore } from '@/store/account';
import {
  Card,
  Avatar,
  TextInput,
  PasswordInput,
  Button,
  Tooltip
} from '@mantine/core';
import { User, AtSign, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const baseFormSchema = z.object({
  name: z.string().max(128).optional(),
  email: z.string().email().optional()
});

export const ProfileSettingsCard = () => {
  const name = useAccountStore((state) => state.name);
  const email = useAccountStore((state) => state.email);
  const isPasswordlessAccount = useAccountStore(
    (state) => state.isPasswordlessAccount
  );

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const setEmail = useAccountStore((state) => state.setEmail);
  const setName = useAccountStore((state) => state.setName);

  useEffect(() => {
    setEditedName(name);
  }, [name]);

  useEffect(() => {
    setEditedEmail(email);
  }, [email]);

  const handleChangeName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdateLoading(true);

    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(e.currentTarget);
    let hasUpdatingErrors = false;

    // Require password only when the email is changed
    const passwordIsRequired = editedEmail !== email;
    const schema = baseFormSchema.extend({
      password: passwordIsRequired ? z.string().min(8) : z.string().optional()
    });

    const passwordValue = formData.get('password');
    const { error, data } = schema.safeParse({
      name: editedName,
      email: editedEmail,
      password: passwordValue === null ? undefined : String(passwordValue)
    });

    if (error) {
      console.log(error);
      toast.error('Something went wrong.');
      setIsUpdateLoading(false);
      return;
    }

    const { password } = data;

    if (editedName !== name) {
      const newName = await updateName(editedName);

      if (newName) {
        setName(newName);
      } else {
        hasUpdatingErrors = true;
        toast.error("Couldn't update name.");
      }
    }

    if (editedEmail !== email) {
      const newEmail = await updateEmail(editedEmail, password!);

      if (newEmail) {
        setEmail(newEmail);
      } else {
        hasUpdatingErrors = true;
        toast.error("Couldn't update email.");
      }
    }

    setIsUpdateLoading(false);

    if (!hasUpdatingErrors) {
      toast.success('Profile updated successfully.');
      formElement.reset();
    }
  };

  return (
    <Card
      className="flex flex-col gap-4 items-center w-full relative"
      radius="md"
      shadow="sm"
      withBorder>
      <Tooltip label="Go back to dashboard" color="gray">
        <Link
          href="/dashboard"
          className="absolute right-2 top-2 hover:bg-zinc-800 transition-colors p-3 rounded-md z-10">
          <Home />
        </Link>
      </Tooltip>
      <h2 className="text-3xl font-bold">Profile</h2>
      <Avatar size="xl" name={name} />
      <form
        className="flex flex-col gap-4 text-lg w-full"
        onSubmit={handleChangeName}>
        <TextInput
          label="Name"
          placeholder={name}
          type="text"
          autoComplete="name"
          name="name"
          leftSection={<User />}
          size="md"
          radius="md"
          required
          withAsterisk={false}
          value={editedName}
          onChange={(e) => setEditedName(e.currentTarget.value)}
        />
        {!isPasswordlessAccount && (
          <>
            <TextInput
              label="Email"
              placeholder={email}
              type="email"
              autoComplete="email"
              name="email"
              leftSection={<AtSign />}
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.currentTarget.value)}
              size="md"
              radius="md"
              required
              withAsterisk={false}
            />
            {editedEmail !== email && (
              <PasswordInput
                label="Password"
                placeholder="********"
                description="Your current password"
                name="password"
                size="md"
                radius="md"
                required
              />
            )}
          </>
        )}
        <Button
          type="submit"
          variant="light"
          color="gray"
          radius="md"
          disabled={isUpdateLoading}
          loading={isUpdateLoading}>
          Update
        </Button>
      </form>
    </Card>
  );
};
