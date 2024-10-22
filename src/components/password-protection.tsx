'use client';

import { Button, Card, PasswordInput } from '@mantine/core';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  code: string;
}

export const PasswordProtection: React.FC<Props> = ({ code }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');

    if (!password) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/link/access/${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      const link = data.link;

      if (link) {
        window.location.replace(link);
      } else {
        toast.error('Password is incorrect');
      }
    } catch (error) {
      toast.error('Failed to access link');
    } finally {
      setIsLoading(false);
    }

    const target = event.target as HTMLFormElement;
    target.reset();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card radius="md" withBorder className="flex flex-col gap-4 p-4">
        <h1 className="text-3xl font-bold">Link protected by password</h1>

        <form
          className="flex flex-col gap-4 items-center w-full"
          onSubmit={handleSubmit}>
          <PasswordInput
            className="w-full"
            label="Password"
            description="Enter the link password"
            placeholder="********"
            name="password"
            size="md"
            radius="md"
            required
          />
          <Button
            className="w-full"
            type="submit"
            variant="light"
            color="gray"
            radius="md"
            size="md"
            loading={isLoading}
            disabled={isLoading}
            leftSection={<Send />}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};
