import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES } from '@/constants';
import { createAdminClient } from './appwrite';
import { ID } from 'node-appwrite';

export async function createMetric(
  linkId: string,
  country: string
): Promise<void> {
  const { database } = await createAdminClient();

  try {
    await database.createDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.metrics,
      ID.unique(),
      {
        linkId,
        countries: [country]
      }
    );
  } catch (error) {
    console.log(error);
  }
}
