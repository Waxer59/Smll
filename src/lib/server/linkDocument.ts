'use server';

import {
  SHORT_ID_INITIAL_LENGTH,
  SHORT_ID_MAX_LENGTH,
  APPWRITE_DATABASES,
  APPWRITE_COLLECTIONS,
  SALT_ROUNDS
} from '@/constants';
import {
  CreateLinkDetails,
  LinkOperationResult,
  OperationResult,
  UpdateLinkDetails
} from '@/types';
import { nanoid } from 'nanoid';
import { Query, ID, Models } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { getLoggedInUser } from './appwrite-functions/auth';
import bcrypt from 'bcrypt';
import { isLinkCorrect } from '@/helpers/isLinkCorrect';

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

export async function getAllShortenedLinksForUser(
  userId: string
): Promise<Models.Document[]> {
  const { database } = await createAdminClient();

  try {
    const links = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      [Query.equal('creatorId', userId)]
    );

    return links.documents;
  } catch (error) {
    return [];
  }
}

export async function getShortenedLinkById(
  id: string,
  userId?: string
): Promise<Models.Document | null> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return null;
    }

    userId = user.$id;
  }

  const { database } = await createAdminClient();

  try {
    const link = await database.getDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      id
    );

    if (!link) {
      return null;
    }

    return link;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function createShortenedLink(
  link: CreateLinkDetails,
  userId?: string
): Promise<LinkOperationResult> {
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

export async function deleteLinkById(
  linkId: string,
  userId?: string
): Promise<OperationResult> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return {
        success: false,
        errors: ['You must be logged in to create a link or use a token.']
      };
    }

    userId = user.$id;
  }

  const { database } = await createAdminClient();

  // Check if the link belongs to the user
  const link = await getShortenedLinkById(linkId, userId);

  if (!link) {
    return { success: false, errors: ['Link not found.'] };
  }

  try {
    await database.deleteDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      linkId
    );
  } catch (error) {
    console.log(error);
    return { success: false, errors: ['Failed to delete link.'] };
  }

  return { success: true, errors: [] };
}

export async function editLinkById(
  linkId: string,
  link: UpdateLinkDetails,
  userId?: string
): Promise<OperationResult> {
  if (!userId) {
    const user = await getLoggedInUser();

    if (!user || user === 'MFA') {
      return {
        success: false,
        errors: ['You must be logged in to create a link or use a token.']
      };
    }

    userId = user.$id;
  }

  const { database } = await createAdminClient();

  // Check if the link belongs to the user
  const linkDocument = await getShortenedLinkById(linkId, userId);

  if (!linkDocument || linkDocument.userId !== userId) {
    return { success: false, errors: ['Link not found.'] };
  }

  console.log('HERE');
  // If the link has links, delete them first
  if (link.links && link.links.length > 0) {
  }

  try {
    await database.updateDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.shortened_links,
      linkId,
      {
        links: link?.links?.map((link) => {
          if (link.password) {
            link.password = bcrypt.hashSync(link.password, SALT_ROUNDS);
          }

          return link;
        }),
        tags: link.tags,
        maxVisits: link.maxVisits,
        activeAt: link.activeAt,
        deleteAt: link.deleteAt,
        isEnabled: link.isEnabled
      }
    );
  } catch (error) {
    console.log(error);
    return { success: false, errors: ['Failed to update link.'] };
  }

  return { success: true, errors: [] };
}
