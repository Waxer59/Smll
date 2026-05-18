import { APPWRITE_COLLECTIONS, APPWRITE_DATABASES } from '@/constants';
import { createAdminClient } from './appwrite';
import { ID, Permission, Query, Role } from 'node-appwrite';
import { MetricRow } from '@/types';

export async function createMetric(
  linkId: string,
  year: number,
  month: number
): Promise<void> {
  const { database } = await createAdminClient();

  try {
    await database.createRow({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.metrics,
      rowId: ID.unique(),
      data: {
        shortenedLinks: [linkId],
        views: 1,
        linkId,
        year,
        month
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getAllMetricsForLinkId(
  linkId: string
): Promise<MetricRow[]> {
  const { database } = await createAdminClient();

  try {
    const metrics = await database.listRows({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.metrics,
      queries: [Query.equal('linkId', linkId)]
    });

    return metrics.rows as unknown as MetricRow[];
  } catch (error) {
    console.log(error);
  }

  return [];
}

export async function getMetricsByLinkIdDate(
  linkId: string,
  year: number,
  month: number
): Promise<MetricRow | null> {
  const { database } = await createAdminClient();

  try {
    const metrics = await database.listRows({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.metrics,
      queries: [
        Query.equal('linkId', linkId),
        Query.equal('year', year),
        Query.equal('month', month)
      ]
    });

    if (metrics.rows.length === 0) {
      return null;
    }

    return metrics.rows[0] as unknown as MetricRow;
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
    await database.updateRow({
      databaseId: APPWRITE_DATABASES.link_shortener,
      tableId: APPWRITE_COLLECTIONS.metrics,
      rowId: metrics.$id,
      data: {
        views: metrics.views + 1
      }
    });
  } catch (error) {
    console.log(error);
  }
}
