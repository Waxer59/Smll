'use server';

import { Cookies, APPWRITE_DATABASES, APPWRITE_COLLECTIONS } from '@/constants';
import { cookies } from 'next/headers';
import { Models, Query, ID, AuthenticationFactor } from 'node-appwrite';
import { createSessionClient, createAdminClient } from '../appwrite';
import { RequireMFA } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function sendVerificationEmail() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    await account.createVerification(BASE_URL + '/api/verify-email');
  } catch (error) {
    console.log(error);
  }
}

export async function getLoggedInUser(): Promise<
  Promise<Models.User<Models.Preferences>> | RequireMFA | null
> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    return await account.get();
  } catch (error: any) {
    if (error.type === 'user_more_factors_required') {
      return 'MFA';
    }

    return null;
  }
}

export async function getCurrentSession(): Promise<Models.Session | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    return null;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<Models.Session | null> {
  let session = null;
  const { account } = await createAdminClient();

  try {
    session = await account.createEmailPasswordSession(email, password);

    cookies().set(Cookies.session, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  } catch (error: any) {
    console.log(error);
    return null;
  }

  return session;
}

export async function createMFAChallenge(): Promise<string | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;
  let challengeId = null;

  try {
    const challenge = await account.createMfaChallenge(
      AuthenticationFactor.Email
    );
    challengeId = challenge.$id;
  } catch (error) {
    console.log(error);
  }

  return challengeId;
}

export async function createMFARecoveryChallenge(): Promise<string | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;
  let challengeId = null;

  try {
    const challenge = await account.createMfaChallenge(
      AuthenticationFactor.Recoverycode
    );
    challengeId = challenge.$id;
  } catch (error) {
    console.log(error);
  }

  return challengeId;
}

export async function registerUser(
  email: string,
  password: string
): Promise<Models.User<Models.Preferences> | null> {
  let user = null;
  const { account } = await createAdminClient();

  const userId = ID.unique();
  const name = email.split('@')[0];

  try {
    user = await account.create(userId, email, password, name);
  } catch (error) {
    console.log(error);
  }

  return user;
}

export async function logoutUser() {
  cookies().delete(Cookies.session);
}

export async function loginWithMagicLink(
  email: string
): Promise<Models.Token | null> {
  const { account } = await createAdminClient();
  let token = null;

  try {
    token = await account.createMagicURLToken(
      ID.unique(),
      email,
      BASE_URL + '/api/create-session'
    );
  } catch (error) {
    console.log(error);
  }

  return token;
}

export async function disableAccountMFA() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return;
  }

  const { account } = sessionClient;

  try {
    await account.updateMFA(false);
  } catch (error) {
    console.log(error);
  }
}

export async function enableAccountMFA(): Promise<string[] | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;
  let recoveryCodes: string[] = [];

  try {
    const mfa = await account.createMfaRecoveryCodes();
    recoveryCodes = mfa.recoveryCodes;
  } catch (error) {
    console.log(error);
  }

  await account.updateMFA(true);

  return recoveryCodes;
}

export async function resetPassword(email: string) {
  const { account } = await createAdminClient();

  try {
    await account.createRecovery(email, BASE_URL + '/reset-password');
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAccount() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return;
  }

  const { database, users } = await createAdminClient();

  const { account } = sessionClient;

  const user = await account.get();
  const userId = user.$id;

  try {
    // Delete all created links
    const links = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('creatorId', [userId])]
    );

    for (const link of links.documents) {
      await database.deleteDocument(
        APPWRITE_DATABASES.link_shortener,
        APPWRITE_COLLECTIONS.shortened_links,
        link.$id
      );
    }

    // Delete all account tokens
    const tokens = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.account_tokens,
      [Query.equal('creatorId', [userId])]
    );

    for (const token of tokens.documents) {
      await database.deleteDocument(
        APPWRITE_DATABASES.link_shortener,
        APPWRITE_COLLECTIONS.account_tokens,
        token.$id
      );
    }

    await users.delete(userId);
  } catch (error) {
    console.log(error);
  }
}

export async function closeAllSessions() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return;
  }

  const { account } = sessionClient;

  try {
    await account.deleteSessions();
  } catch (error) {
    console.log(error);
  }
}

export async function getUserAccountSession(): Promise<Models.Session | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    return null;
  }
}

export async function verifyMFA(
  challengeId: string,
  code: string
): Promise<boolean> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return false;
  }

  const { account } = sessionClient;

  try {
    await account.updateMfaChallenge(challengeId, code);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}
