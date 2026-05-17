'use client';

import {
  APPWRITE_PROVIDERS,
  BROADCAST_CHANNEL,
  BROADCAST_CHANNEL_MESSAGE
} from '@/constants';
import { getUserShortenedLinks } from '@/lib/server/appwrite';
import { getUserTokens } from '@/lib/server/appwrite-functions/account';
import {
  closeAllSessions,
  getLoggedInUser,
  getUserAccountSession,
  logoutUser
} from '@/lib/server/appwrite-functions/auth';
import { useAccountStore } from '@/store/account';
import { useLinksStore } from '@/store/links';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<Props> = ({ children }) => {
  const setLinks = useLinksStore((state) => state.setLinks);
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
      try {
        const [user, accountLinks, accountTokens, userAccountSession] =
          await Promise.all([
            getLoggedInUser(),
            getUserShortenedLinks(),
            getUserTokens(),
            getUserAccountSession()
          ]);

        if (!user || !userAccountSession) {
          router.push('/');
          return;
        }

        setLinks(accountLinks ?? []);
        setTokens(accountTokens ?? []);
        setName(user.name!);
        setEmail(user.email!);
        setHasEmailVerification(user.emailVerification!);
        setIsPasswordlessAccount(
          userAccountSession.provider === APPWRITE_PROVIDERS.oauth2 ||
            userAccountSession.provider === APPWRITE_PROVIDERS.magicUrl
        );
      } catch (error) {
        toast.error('There was an error while loading your account.');
        await closeAllSessions();
        logoutUser();
        router.push('/');
        return;
      }
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
    setTokens,
    setLinks
  ]);

  return <>{children}</>;
};
