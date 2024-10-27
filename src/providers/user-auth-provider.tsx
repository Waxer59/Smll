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
import { useLinksStore } from '@/store/links';
import { LinkDetails, RequireMFA, TokenDetails } from '@/types';
import { useRouter } from 'next/navigation';
import { Models } from 'appwrite';
import React, { useEffect } from 'react';
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
  const setHasMFA = useAccountStore((state) => state.setHasMFA);
  const setTokens = useAccountStore((state) => state.setTokens);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasVerifiedEmail = url.searchParams.get('verified') === 'true';

    async function initAccountStore() {
      const userData: [
        Promise<Promise<Models.User<Models.Preferences>> | RequireMFA | null>,
        Promise<LinkDetails[] | null>,
        Promise<TokenDetails[] | null>,
        Promise<Models.Session | null>
      ] = [
        getLoggedInUser(),
        getUserShortenedLinks(),
        getUserTokens(),
        getUserAccountSession()
      ];

      try {
        const resolvedUserData = await Promise.all(userData);
        const [user, accountLinks, accountTokens, userAccountSession] =
          resolvedUserData;

        if (!user) {
          router.push('/');
          return;
        } else if (user === 'MFA') {
          router.push('/mfa');
          return;
        } else if (!userAccountSession) {
          router.push('/');
          return;
        }

        setName(user.name);
        setHasMFA(user.mfa);
        setEmail(user.email);
        setHasEmailVerification(user.emailVerification);
        setLinks(accountLinks ?? []);
        setTokens(accountTokens ?? []);
        setIsPasswordlessAccount(
          userAccountSession.provider === APPWRITE_PROVIDERS.oauth2 ||
            userAccountSession.provider === APPWRITE_PROVIDERS.magicUrl
        );
      } catch (error) {
        toast.error('There was an error while loading your account.');
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
    setHasMFA,
    setTokens,
    setLinks
  ]);

  return <>{children}</>;
};
