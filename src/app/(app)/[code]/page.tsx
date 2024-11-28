import { PasswordProtection } from '@/components/password-protection';
import { getShortenedLinkByCode } from '@/lib/server/linkDocument';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { createMetric } from '@/lib/server/metricsDocument';
import { headers } from 'next/headers';

export default async function Page({
  params: { code }
}: {
  params: { code: string };
}) {
  const link = await getShortenedLinkByCode(code);
  const city = headers().get('X-Vercel-IP-City') ?? 'Unknown';

  if (!link) {
    notFound();
  }

  const havePassword = link.links.some((link: any) => link.password);
  const isActive = link.activeAt ? new Date() < link.activeAt : true;
  const isExpired = link.deleteAt ? new Date() > link.deleteAt : false;

  if (!isActive || isExpired || !link.isEnabled) {
    notFound();
  }

  if (link.metrics && link.metrics.length === 0) {
    createMetric(link.id, city);
  }

  if (!havePassword) {
    redirect(link.links[0].url, RedirectType.replace);
  }

  return <PasswordProtection code={code} />;
}
