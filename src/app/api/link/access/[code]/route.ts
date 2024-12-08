import { getLinkByPassword } from '@/helpers/getLinkByPassword';
import { accessLink } from '@/lib/server/accessLink';
import { getShortenedLinkByCode } from '@/lib/server/linkDocument';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
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
    return NextResponse.json({ link: link.links[0].url }, { status: 200 });
  }

  const requestBody = await request.json();
  const passwordGiven = requestBody.password;

  if (!passwordGiven) {
    return NextResponse.json(
      { error: 'Password is required' },
      { status: 401 }
    );
  }

  const linkFound = await getLinkByPassword(link.links, passwordGiven);

  if (!linkFound) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  return NextResponse.json({ link: linkFound });
}
