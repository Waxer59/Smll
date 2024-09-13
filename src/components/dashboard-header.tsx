'use client';

import { logoutUser } from '@/lib/server/appwrite';
import { ActionIcon, Avatar, Menu, VisuallyHidden } from '@mantine/core';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DashboardHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <header className="bg-neutral-800 py-4">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-white">Smll</h1>
        <Menu shadow="md" width={200} radius="md">
          <Menu.Target>
            <ActionIcon variant="transparent" className="overflow-visible">
              <VisuallyHidden>Account</VisuallyHidden>
              <Avatar name="Hugo Boyano" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<User />}
              onClick={() => router.push('/dashboard/account')}>
              Account
            </Menu.Item>
            <Menu.Item
              leftSection={<LogOut />}
              color="red"
              onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
};
