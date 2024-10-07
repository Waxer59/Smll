'use server';

import {
  Client,
  Account,
  type Models,
  Databases,
  Avatars,
  Users,
  Query
} from 'node-appwrite';
import { cookies } from 'next/headers';
import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES, Cookies } from '@/constants';
import { getLoggedInUser } from './appwrite-functions/auth';

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
    },
    get database() {
      return new Databases(client);
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

export async function getUserShortenedLinks(
  userId?: string
): Promise<Models.DocumentList<Models.Document> | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
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
