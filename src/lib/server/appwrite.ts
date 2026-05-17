'use server';

import {
  Client,
  Account,
  Databases,
  Avatars,
  Users,
  Query,
  TablesDB
} from 'node-appwrite';
import { cookies } from 'next/headers';
import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES, Cookies } from '@/constants';
import { getLoggedInUser } from './appwrite-functions/auth';
import { LinkDetails } from '@/types';
import { decrypt } from './encryption';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;
const NEXT_PUBLIC_APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const NEXT_PUBLIC_APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

export async function createSessionClient(token?: string) {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookieSession = token ?? (await cookies()).get(Cookies.session)?.value;

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
      return new TablesDB(client);
    },
    get users() {
      return new Users(client);
    }
  };
}

export async function getUserShortenedLinks(
  userId?: string
): Promise<LinkDetails[] | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return null;
    }

    userId = user.$id;
  }

  const { database } = await createAdminClient();
  let links: LinkDetails[] | null = null;

  try {
    const resp = await database.listRows({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.shortened_links,
      queries: [
        Query.equal('creatorId', [userId]),
        Query.select(['*', 'links.*', 'metrics.*'])
      ]
    });

    links = resp.rows.map(
      ({
        $id,
        $createdAt,
        code,
        isEnabled,
        tags,
        activeAt,
        deleteAt,
        links: linksDocument,
        maxVisits,
        metrics
      }) => ({
        id: $id,
        code,
        isEnabled,
        createdAt: new Date($createdAt),
        tags,
        activeAt: activeAt ? new Date(activeAt) : undefined,
        deleteAt: deleteAt ? new Date(deleteAt) : undefined,
        links: linksDocument?.map((ld: any) => ({
          id: ld.$id,
          url: decrypt(ld.url),
          password: ld.password ?? null
        })),
        shortenedLink: `${NEXT_PUBLIC_BASE_URL}/${code}`,
        isProtectedByPassword: Boolean(linksDocument?.[0]?.password),
        isSmartLink: Boolean((linksDocument?.length ?? 0) > 1),
        maxVisits,
        originalLink: linksDocument?.[0] ? decrypt(linksDocument[0].url) : '',
        metrics: Array.isArray(metrics)
          ? metrics.map((m: any) => ({
              $id: m.$id,
              createdAt: m.$createdAt,
              views: m.views,
              year: m.year,
              month: m.month,
              linkId: m.linkId
            }))
          : []
      })
    );
  } catch (error) {
    console.log(error);
  }

  return links;
}
