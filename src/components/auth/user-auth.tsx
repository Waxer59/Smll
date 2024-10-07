'use client';

import {
  APPWRITE_PROVIDERS,
  BROADCAST_CHANNEL,
  BROADCAST_CHANNEL_MESSAGE
} from '@/constants';
import { getUserShortenedLinks } from '@/lib/server/appwrite';
import { getUserTokens } from '@/lib/server/appwrite-functions/account';
import {
  getLoggedInUser,
  getUserAccountSession
} from '@/lib/server/appwrite-functions/auth';
import { useAccountStore } from '@/store/account';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export const UserAuth: React.FC<Props> = ({ children }) => {
  const setName = useAccountStore((state) => state.setName);
  const setEmail = useAccountStore((state) => state.setEmail);
  const setHasEmailVerification = useAccountStore(
    (state) => state.setHasEmailVerification
  );
  const setIsPasswordlessAccount = useAccountStore(
    (state) => state.setIsPasswordlessAccount
  );
  const setTokens = useAccountStore((state) => state.setTokens);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasVerifiedEmail = url.searchParams.get('verified') === 'true';

    async function initAccountStore() {
      const user = await getLoggedInUser();

      if (user === 'MFA') {
        router.push('/login?mfa=true');
        return;
      }

      const userAccountSession = await getUserAccountSession();
      const accountLinks = await getUserShortenedLinks();
      const accountTokens = await getUserTokens();

      if (!user || !userAccountSession) {
        router.push('/');
        return;
      }

      setName(user.name);
      setEmail(user.email);
      setHasEmailVerification(user.emailVerification);
      setTokens(accountTokens ?? []);
      setIsPasswordlessAccount(
        userAccountSession.provider === APPWRITE_PROVIDERS.oauth2 ||
          userAccountSession.provider === APPWRITE_PROVIDERS.magicUrl
      );
    }

    initAccountStore();

    const broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL.auth);

    broadcastChannel.onmessage = (event) => {
      if (event.data === BROADCAST_CHANNEL_MESSAGE.login) {
        window.location.reload();
      }
    };

    if (hasVerifiedEmail) {
      broadcastChannel.postMessage(BROADCAST_CHANNEL_MESSAGE.login);

      // Remove the query param
      url.searchParams.delete('verified');
      window.location.href = url.toString();
    }

    return () => {
      broadcastChannel.close();
    };
  }, [
    router,
    setEmail,
    setHasEmailVerification,
    setIsPasswordlessAccount,
    setName,
    setTokens
  ]);

  return <>{children}</>;
};
