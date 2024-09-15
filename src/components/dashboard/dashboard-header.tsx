'use client';

import { getLoggedInUser, logoutUser } from '@/lib/server/appwrite';
import { ActionIcon, Avatar, Menu, VisuallyHidden } from '@mantine/core';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAccountStore } from '@/store/account';
import { UserPrefs } from '@/types';

export const DashboardHeader = () => {
  const router = useRouter();
  const name = useAccountStore((state) => state.name);
  const setName = useAccountStore((state) => state.setName);
  const setEmail = useAccountStore((state) => state.setEmail);
  const setIsFirstTimeUser = useAccountStore(
    (state) => state.setIsFirstTimeUser
  );

  useEffect(() => {
    async function initAccountStore() {
      const user = await getLoggedInUser();
      const userPrefs = user?.prefs;

      if (!user) {
        router.push('/');
        return;
      }

      setName(user.name);
      setEmail(user.email);

      if (userPrefs) {
        setIsFirstTimeUser(user.prefs[UserPrefs.isFirstTimeUser]);
      }
    }

    initAccountStore();
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-neutral-800 py-4">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-2xl font-medium text-white hover:text-white/80 transition-colors">
            Smll
          </h1>
        </Link>
        <Menu shadow="md" width={200} radius="md">
          <Menu.Target>
            <ActionIcon variant="transparent" className="overflow-visible">
              <VisuallyHidden>Account</VisuallyHidden>
              <Avatar name={name} />
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
