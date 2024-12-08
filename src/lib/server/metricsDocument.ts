import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES } from '@/constants';
import { createAdminClient } from './appwrite';
import { ID, Models, Query } from 'node-appwrite';

export async function createMetric(
  linkId: string,
  year: number,
  month: number
): Promise<void> {
  const { database } = await createAdminClient();

  try {
    await database.createDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.metrics,
      ID.unique(),
      {
        shortenedLinks: [linkId],
        views: 1,
        linkId,
        year,
        month
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getAllMetricsForLinkId(
  linkId: string
): Promise<Models.Document[]> {
  const { database } = await createAdminClient();

  try {
    const metrics = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.metrics,
      [Query.equal('linkId', linkId)]
    );

    return metrics.documents;
  } catch (error) {
    console.log(error);
  }

  return [];
}

export async function getMetricsByLinkIdDate(
  linkId: string,
  year: number,
  month: number
): Promise<Models.Document | null> {
  const { database } = await createAdminClient();

  try {
    const metrics = await database.listDocuments(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.metrics,
      [
        Query.equal('linkId', linkId),
        Query.equal('year', year),
        Query.equal('month', month)
      ]
    );

    return metrics.documents[0];
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function updateMetric(
  linkId: string,
  year: number,
  month: number
): Promise<void> {
  const { database } = await createAdminClient();

  const metrics = await getMetricsByLinkIdDate(linkId, year, month);

  if (!metrics) {
    return;
  }

  try {
    await database.updateDocument(
      APPWRITE_DATABASES.link_shortener,
      APPWRITE_COLLECTIONS.metrics,
      metrics.$id,
      {
        views: metrics.views + 1
      }
    );
  } catch (error) {
    console.log(error);
  }
}
