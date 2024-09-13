'use server';

import { Client, Account, type Models, ID, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';
import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES, Cookies } from '@/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;
const NEXT_PUBLIC_APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const NEXT_PUBLIC_APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookieSession = cookies().get(Cookies.session);

  if (!cookieSession || !cookieSession.value) {
    return null;
  }

  client.setSession(cookieSession.value);

  return {
    get account() {
      return new Account(client);
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
    }
  };
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

export async function loginUser(
  email: string,
  password: string
): Promise<Models.Session | null> {
  let session = null;
  const { account } = await createAdminClient();

  try {
    session = await account.createEmailPasswordSession(email, password);

    // Set cookie
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

  const name = email.split('@')[0];

  try {
    user = await account.create(ID.unique(), email, password, name);
  } catch (error) {
    console.log(error);
  }

  return user;
}

export const logoutUser = async () => {
  cookies().delete(Cookies.session);
};

export const loginWithMagicLink = async (
  email: string
): Promise<Models.Token | null> => {
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
};

export const resetPassword = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    await account.createRecovery(email, BASE_URL + '/reset-password');
  } catch (error) {
    console.log(error);
  }
};
