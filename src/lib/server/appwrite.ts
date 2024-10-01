'use server';

import {
  Client,
  Account,
  type Models,
  ID,
  Databases,
  Avatars,
  Users,
  Query
} from 'node-appwrite';
import { cookies } from 'next/headers';
import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES, Cookies } from '@/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;
const NEXT_PUBLIC_APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const NEXT_PUBLIC_APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

export async function createSessionClient(token?: string) {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookieSession = token ?? cookies().get(Cookies.session)?.value;

  if (cookieSession) {
    client.setSession(cookieSession);
  }

  return {
    get account() {
      return new Account(client);
    },
    get avatar() {
      return new Avatars(client);
    }
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    }
  };
}

export async function sendVerificationEmail() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    await account.createVerification(BASE_URL + '/api/confirm-email');
  } catch (error) {
    console.log(error);
  }
}

export async function getLoggedInUser() {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(
  email: string
): Promise<Models.UserList<Models.Preferences>> {
  const { users } = await createAdminClient();
  return await users.list([Query.equal('email', email)]);
}

export async function getUserById(
  userId: string
): Promise<Models.User<Models.Preferences>> {
  const { users } = await createAdminClient();
  return await users.get(userId);
}

export async function updateUserPrefs(
  userId: string,
  prefs: Record<string, any>
): Promise<Models.User<Models.Preferences>> {
  const { users } = await createAdminClient();
  return await users.updatePrefs(userId, prefs);
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
  } catch (error) {
    console.log(error);
  }

  return session;
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

export async function resetPassword(email: string) {
  const { account } = await createAdminClient();

  try {
    await account.createRecovery(email, BASE_URL + '/reset-password');
  } catch (error) {
    console.log(error);
  }
}

export async function updateName(name: string): Promise<string | null> {
  const sessionClient = await createSessionClient();
  let newName = null;

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    await account.updateName(name);
    newName = name;
  } catch (error) {
    console.log(error);
  }

  return newName;
}

export async function updateEmail(email: string, password: string) {
  const sessionClient = await createSessionClient();
  let newEmail = null;

  if (!sessionClient) {
    return;
  }

  const { account } = sessionClient;

  try {
    await account.updateEmail(email, password);
    newEmail = email;
  } catch (error) {
    console.log(error);
  }

  return newEmail;
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
