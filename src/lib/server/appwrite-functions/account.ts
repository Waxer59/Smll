'use server';

import { ID, Models, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import jwt from 'jsonwebtoken';
import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES } from '@/constants';
import { TokenDetails } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function updateUserPrefs(
  userId: string,
  prefs: Record<string, any>
): Promise<Models.User<Models.Preferences>> {
  const { users } = await createAdminClient();
  return await users.updatePrefs(userId, prefs);
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

export async function getUserTokens(): Promise<TokenDetails[] | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account, database } = sessionClient;

  const user = await account.get();
  let tokens = null;

  try {
    const resp = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.account_tokens,
      [Query.equal('creatorId', user.$id)]
    );

    tokens = resp.documents.map((token) => ({
      id: token.$id,
      token: token.token
    }));
  } catch (error) {
    console.log(error);
  }

  return tokens;
}

export async function createAccountToken(): Promise<TokenDetails | null> {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account, database } = sessionClient;

  const user = await account.get();

  const token = jwt.sign({ userId: user.$id }, JWT_SECRET);

  let tokenEntry = null;

  try {
    tokenEntry = await database.createDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.account_tokens,
      ID.unique(),
      {
        token,
        creatorId: user.$id
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }

  return {
    id: tokenEntry.$id,
    token: token
  };
}

export async function deleteAccountToken(deleteToken: string) {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return;
  }

  const { database } = sessionClient;
  const userTokens = await getUserTokens();

  if (!userTokens) {
    return;
  }

  const tokenId = userTokens.find(({ token }) => deleteToken === token)?.id;

  if (!tokenId) {
    return;
  }

  try {
    await database.deleteDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.account_tokens,
      tokenId
    );
  } catch (error) {
    console.log(error);
  }
}
