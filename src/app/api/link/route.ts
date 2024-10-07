import {
  SHORT_ID_INITIAL_LENGTH,
  SHORT_ID_MAX_LENGTH,
  APPWRITE_DATABASES,
  APPWRITE_COLLECTIONS,
  SALT_ROUNDS
} from '@/constants';
import { shortenedLinkSchema } from '@/constants/schemas';
import { createAdminClient } from '@/lib/server/appwrite';
import { getLoggedInUser } from '@/lib/server/appwrite-functions/auth';
import { CreateLinkDetails } from '@/types';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { areAllLinksPasswordsUnique } from '@/helpers/areAllLinksPasswordsUnique';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

async function createUniqueLinkCode(
  length = SHORT_ID_INITIAL_LENGTH
): Promise<string | null> {
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

async function createShortenedLink(
  link: CreateLinkDetails,
  userId?: string
): Promise<string | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return null;
    }

    userId = user.$id;
  }

  // TODO: Check if one link have password, if so, all links must have password

  const areAllPasswordsUnique = areAllLinksPasswordsUnique(link.links);

  if (!areAllPasswordsUnique) {
    return null;
  }

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
  } catch (error) {
    return null;
  }

  return `${BASE_URL}/${uniqueCode}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { error } = shortenedLinkSchema.safeParse(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { link } = body;

  const shortenedLink = await createShortenedLink(link);

  if (!shortenedLink) {
    return NextResponse.json(
      { error: 'Failed to create shortened link.' },
      {
        status: 500
      }
    );
  }

  return NextResponse.json({ shortenedLink });
}
