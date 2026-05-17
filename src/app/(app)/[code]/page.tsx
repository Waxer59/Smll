import { PasswordProtection } from '@/components/password-protection';
import { getShortenedLinkByCode } from '@/lib/server/linkDocument';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { accessLink } from '@/lib/server/accessLink';
import { decrypt } from '@/lib/server/encryption';

export const revalidate = 0;

export default async function Page({
  params: { code }
}: {
  params: { code: string };
}) {
  const link = await getShortenedLinkByCode(code);

  if (!link) {
    notFound();
  }

  const { havePassword, isActive, isExpired, isEnabled, hasReachedMaxVisits } =
    await accessLink(link);

  if (!isActive || isExpired || !isEnabled || hasReachedMaxVisits) {
    notFound();
  }

  if (!havePassword) {
    redirect(decrypt(link.links[0].url), RedirectType.replace);
  }

  return <PasswordProtection code={code} />;
}
