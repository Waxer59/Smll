'use client';

import { updateName, updateEmail } from '@/lib/server/appwrite';
import { useAccountStore } from '@/store/account';
import { Card, Avatar, TextInput, PasswordInput, Button } from '@mantine/core';
import { User, AtSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string()
});

export const ProfileSettingsCard = () => {
  const name = useAccountStore((state) => state.name);
  const email = useAccountStore((state) => state.email);
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

    const formData = new FormData(e.currentTarget);

    const { error, data } = formSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (error) {
      toast.error('Something went wrong.');
      setIsUpdateLoading(false);
      return;
    }

    const { name, email, password } = data;

    if (name) {
      setName(name);
      updateName(name);
    }

    if (email) {
      await updateEmail(email, password);
      setEmail(email);
    }

    setIsUpdateLoading(false);
    toast.success('Profile updated successfully.');
  };

  return (
    <Card
      className="flex flex-col gap-4 items-center w-full"
      radius="md"
      shadow="sm"
      withBorder>
      <h2 className="text-3xl font-bold">Profile</h2>
      <Avatar size="xl" name={name} />
      <form
        className="flex flex-col gap-4 text-lg w-full"
        onSubmit={handleChangeName}>
        <TextInput
          label="Name"
          placeholder="Smll"
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
        <TextInput
          label="Email"
          placeholder="shortlinks@smll.app"
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
        <PasswordInput
          label="Password"
          placeholder="********"
          description="Your current password"
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
          disabled={isUpdateLoading}
          loading={isUpdateLoading}>
          Update
        </Button>
      </form>
    </Card>
  );
};
