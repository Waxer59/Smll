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
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import {
  APPWRITE_COLLECTIONS,
  APPWRITE_DATABASES,
  Cookies,
  SALT_ROUNDS,
  SHORT_ID_INITIAL_LENGTH,
  SHORT_ID_MAX_LENGTH
} from '@/constants';
import { CreateLinkDetails } from '@/types';
import { shortenedLinkSchema } from '@/constants/schemas';

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
    await account.createVerification(BASE_URL + '/api/verify-email');
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

export async function getUserShortenedLinks(
  userId?: string
): Promise<Models.DocumentList<Models.Document> | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user) {
      return null;
    }

    userId = user.$id;
  }

  const { database } = await createAdminClient();
  let links = null;

  try {
    links = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('creatorId', [userId])]
    );
  } catch (error) {
    console.log(error);
  }

  return links;
}

async function createUniqueLinkCode(length = SHORT_ID_INITIAL_LENGTH) {
  const { database } = await createAdminClient();

  if (length > SHORT_ID_MAX_LENGTH) {
    return null;
  }

  const code = nanoid(length);

  try {
    const link = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('code', code)]
    );

    if (link.total === 0) {
      return code;
    } else {
      return createUniqueLinkCode(length + 1);
    }
  } catch (error) {
    return null;
  }
}

export async function createShortenedLink(
  link: CreateLinkDetails,
  userId?: string
): Promise<string | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user) {
      return null;
    }

    userId = user.$id;
  }

  const { error } = shortenedLinkSchema.safeParse(link);

  if (error) {
    return null;
  }

  // TODO: unique passwords

  const { database } = await createAdminClient();

  // Hash all links passwords
  const hashedLinks = link.links.map(async (link) => {
    if (link.password) {
      link.password = await bcrypt.hash(link.password, SALT_ROUNDS);
    }

    return link;
  });

  link.links = await Promise.all(hashedLinks);

  const uniqueCode = await createUniqueLinkCode();

  if (!uniqueCode) {
    return null;
  }

  try {
    await database.createDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      ID.unique(),
      {
        code: uniqueCode,
        creatorId: userId,
        ...link
      }
    );
  } catch (error) {}

  return '';
}
