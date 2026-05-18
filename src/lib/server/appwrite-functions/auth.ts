'use server';

import { Cookies, APPWRITE_DATABASES, APPWRITE_COLLECTIONS } from '@/constants';
import { cookies } from 'next/headers';
import { Models, Query, ID } from 'node-appwrite';
import { createSessionClient, createAdminClient } from '../appwrite';
import { User } from '@/types';

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

export async function getLoggedInUser(): Promise<User | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    const user = await account.get();
    return {
      $id: user.$id,
      name: (user as any).name,
      email: (user as any).email,
      emailVerification: (user as any).emailVerification
    };
  } catch (error: any) {
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
): Promise<boolean> {
  let session = null as any;
  const { account } = await createAdminClient();

  try {
    session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(Cookies.session, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  } catch (error: any) {
    console.log(error);
    return false;
  }

  return Boolean(session);
}

export async function registerUser(
  email: string,
  password: string
): Promise<boolean> {
  const { account } = await createAdminClient();

  const userId = ID.unique();
  const name = email.split('@')[0];

  try {
    await account.create(userId, email, password, name);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function logoutUser() {
  (await cookies()).delete(Cookies.session);
}

export async function loginWithMagicLink(email: string): Promise<boolean> {
  const { account } = await createAdminClient();
  let token = null as any;

  try {
    token = await account.createMagicURLToken(
      ID.unique(),
      email,
      BASE_URL + '/api/create-session'
    );
  } catch (error) {
    console.log(error);
    return false;
  }

  return Boolean(token);
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
    const links = await database.listRows({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.shortened_links,
      queries: [Query.equal('creatorId', [userId])]
    });

    for (const link of links.rows) {
      await database.deleteRow({
        databaseId: APPWRITE_DATABASES.link_shortener,
        tableId: APPWRITE_COLLECTIONS.shortened_links,
        rowId: link.$id
      });
    }

    // Delete all account tokens
    const tokens = await database.listRows({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.account_tokens,
      queries: [Query.equal('creatorId', [userId])]
    });

    for (const token of tokens.rows) {
      await database.deleteRow({
        databaseId: APPWRITE_DATABASES.link_shortener,
        tableId: APPWRITE_COLLECTIONS.account_tokens,
        rowId: token.$id
      });
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

export async function getUserAccountSession(): Promise<{
  provider?: string;
} | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    const session = await account.getSession({ sessionId: 'current' });
    return { provider: (session as any).provider };
  } catch (error) {
    return null;
  }
}
