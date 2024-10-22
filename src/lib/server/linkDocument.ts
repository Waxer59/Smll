import {
  SHORT_ID_INITIAL_LENGTH,
  SHORT_ID_MAX_LENGTH,
  APPWRITE_DATABASES,
  APPWRITE_COLLECTIONS,
  SALT_ROUNDS
} from '@/constants';
import { areAllLinksPasswordsUnique } from '@/helpers/areAllLinksPasswordsUnique';
import { CreateLinkDetails, LinkDetails, SingleLinkDetails } from '@/types';
import { nanoid } from 'nanoid';
import { Query, ID, Models } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { getLoggedInUser } from './appwrite-functions/auth';
import bcrypt, { compareSync } from 'bcrypt';
import { isDateBefore } from '@/helpers/isDateBefore';
import { isFutureDate } from '@/helpers/isFutureDate';
import { z } from 'zod';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function isCodeAvailable(code: string): Promise<boolean> {
  const { database } = await createAdminClient();

  try {
    const link = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('code', code)]
    );

    return link.total === 0;
  } catch (error) {
    console.log(error);
  }

  return false;
}

export async function createUniqueLinkCode(
  length = SHORT_ID_INITIAL_LENGTH
): Promise<string | null> {
  if (length > SHORT_ID_MAX_LENGTH) {
    return null;
  }

  const code = nanoid(length);

  const isAvailable = await isCodeAvailable(code);

  return isAvailable ? code : createUniqueLinkCode(length + 1);
}

export function isLinkCorrect(link: CreateLinkDetails): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Password must be at least 1 character
  if (
    link.links.some((l) => (l.password ? l.password.trim().length < 1 : false))
  ) {
    errors.push('Password must be at least 1 character.');
  }

  // Links must be valid urls
  if (
    link.links.some((link) => {
      const urlSchema = z.string().url();
      return !urlSchema.safeParse(link.url).success;
    })
  ) {
    errors.push('Links must be valid urls.');
  }

  // Expire date must be before active date
  if (
    link.activeAt &&
    link.deleteAt &&
    isDateBefore(link.deleteAt, link.activeAt)
  ) {
    errors.push('Expire date must be before active date.');
  }

  // Max clicks must be greater than 0
  if (link.maxVisits !== undefined && link.maxVisits < 1) {
    errors.push('Max visits must be greater than 0.');
  }

  // A tag must be at least 1 character
  if (link.tags && link.tags.some((tag) => tag.trim().length < 1)) {
    errors.push('A tag must be at least 1 character.');
  }

  // Dates must be in the future
  if (link.activeAt && !isFutureDate(link.activeAt)) {
    errors.push('Active date must be in the future.');
  }

  if (link.deleteAt && !isFutureDate(link.deleteAt)) {
    errors.push('Expire date must be in the future.');
  }

  // If one link have password, then all links must have password
  const havePassword = link.links.some((link) => link.password);
  const haveAllLinksPasswords = link.links.every((link) => link.password);

  if (havePassword && !haveAllLinksPasswords) {
    errors.push(
      'If one link have password, then all links must have password.'
    );
  }

  const areAllPasswordsUnique = areAllLinksPasswordsUnique(link.links);

  if (!areAllPasswordsUnique) {
    errors.push('All links passwords must be unique.');
  }

  return { success: errors.length === 0, errors };
}

export async function getShortenedLinkByCode(
  code: string
): Promise<Models.Document | null> {
  const { database } = await createAdminClient();

  try {
    const link = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('code', code)]
    );

    if (link.total === 0) {
      return null;
    }

    return link.documents[0];
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function createShortenedLink(
  link: CreateLinkDetails,
  userId?: string
): Promise<{
  success: boolean;
  errors: string[];
  shortenedLink: LinkDetails | null;
}> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return {
        success: false,
        errors: ['You must be logged in to create a link or use a token.'],
        shortenedLink: null
      };
    }

    userId = user.$id;
  }

  const { success, errors } = isLinkCorrect(link);

  if (!success) {
    return { success, errors, shortenedLink: null };
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

  // Generate unique code
  let uniqueCode: string | null;

  if (link.code && link.code.trim().length > 0) {
    const isAvailable = await isCodeAvailable(link.code);

    if (!isAvailable) {
      return {
        success: false,
        errors: ['Code is already in use.'],
        shortenedLink: null
      };
    }

    uniqueCode = link.code;
  } else {
    uniqueCode = await createUniqueLinkCode();

    if (!uniqueCode) {
      return {
        success: false,
        errors: ['Failed to generate unique code.'],
        shortenedLink: null
      };
    }
  }

  try {
    const {
      $id,
      $collectionId,
      $createdAt,
      $databaseId,
      $permissions,
      $updatedAt,
      ...linkDocument
    } = await database.createDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      ID.unique(),
      {
        ...link,
        code: uniqueCode,
        creatorId: userId
      }
    );

    return {
      success: true,
      errors: [],
      shortenedLink: {
        id: $id,
        links: linkDocument.links.map(
          ({ $id, url }: { $id: string; url: string }) => ({
            id: $id,
            url
          })
        ),
        code: linkDocument.code,
        tags: linkDocument.tags,
        maxVisits: linkDocument.maxVisits,
        activeAt: linkDocument.activeAt,
        deleteAt: linkDocument.deleteAt,
        isEnabled: true,
        originalLink: link.links[0].url,
        shortenedLink: `${NEXT_PUBLIC_BASE_URL}/${uniqueCode}`,
        createdAt: new Date($createdAt),
        clicks: 0,
        isProtectedByPassword: Boolean(link.links[0].password),
        isSmartLink: Boolean(link.links.length > 1),
        metrics: []
      }
    };
  } catch (error) {
    console.log(error);
  }

  return { success: false, errors: [], shortenedLink: null };
}

export async function getLinkByPassword(
  links: SingleLinkDetails[],
  password: string
): Promise<string | null> {
  const link = links.find(
    (link) => link.password && compareSync(password, link.password)
  );

  if (!link) {
    return null;
  }

  return link.url;
}
