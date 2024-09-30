'use client';

/* eslint-disable react/no-unescaped-entities */
import { Card, TextInput } from '@mantine/core';
import { House } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const RETURN_HOME_TEXT = 'home';
const RETURN_HOME_TIMEOUT = 500; // ms

export default function NotFound() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleHomeInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value.toLowerCase() === RETURN_HOME_TEXT) {
      setIsRedirecting(true);

      const returnHomePromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          router.push('/');
        }, RETURN_HOME_TIMEOUT);
      });

      toast.promise(returnHomePromise, {
        loading: 'Redirecting...',
        success: 'Redirected!',
        error: 'Redirect failed!'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card
        className="max-w-sm flex flex-col items-center gap-6"
        radius="md"
        shadow="sm"
        withBorder>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">404: Not Found</h1>
          <p className="text-xl text-center">
            Link stuck in digital traffic. Spell 'home' for the express lane!
          </p>
        </div>
        <TextInput
          onChange={handleHomeInput}
          placeholder="Home"
          label="Type 'Home' to return:"
          type="text"
          size="md"
          radius="md"
          className="w-full"
          disabled={isRedirecting}
        />
        <Link
          href="/"
          className="flex items-center gap-2 text-sm bg-neutral-900 p-2 rounded-md hover:bg-neutral-800 transition-colors">
          <House size={24} /> Return Home
        </Link>
      </Card>
    </div>
  );
}
