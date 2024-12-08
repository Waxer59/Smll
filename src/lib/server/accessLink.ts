import { LinkDetails } from '@/types';
import {
  getMetricsByLinkIdDate,
  getAllMetricsForLinkId,
  updateMetric,
  createMetric
} from './metricsDocument';
import { Models } from 'node-appwrite';

interface AccessLink {
  havePassword: boolean;
  isActive: boolean;
  isExpired: boolean;
  isEnabled: boolean;
  hasReachedMaxVisits: boolean;
}

export async function accessLink(link: Models.Document): Promise<AccessLink> {
  const havePassword = link.links.some((link: any) => link.password);
  const isActive = link.activeAt ? new Date() < link.activeAt : true;
  const isExpired = link.deleteAt ? new Date() > link.deleteAt : false;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthMetrics = await getMetricsByLinkIdDate(
    link.$id,
    currentYear,
    currentMonth
  );
  const allMetrics = await getAllMetricsForLinkId(link.$id);
  const totalViews = allMetrics.reduce((acc, metric) => acc + metric.views, 0);
  const hasReachedMaxVisits = link.maxVisits
    ? totalViews >= link.maxVisits
    : false;

  if (monthMetrics && !hasReachedMaxVisits) {
    updateMetric(link.$id, currentYear, currentMonth);
  } else if (!hasReachedMaxVisits) {
    createMetric(link.$id, currentYear, currentMonth);
  }

  return {
    havePassword,
    isActive,
    isExpired,
    isEnabled: link.isEnabled,
    hasReachedMaxVisits
  };
}
