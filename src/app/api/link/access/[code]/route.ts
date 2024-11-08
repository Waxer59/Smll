import { getLinkByPassword } from '@/helpers/getLinkByPassword';
import { getShortenedLinkByCode } from '@/lib/server/linkDocument';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  const link = await getShortenedLinkByCode(code);

  if (!link) {
    notFound();
  }

  const havePassword = link.links.some((link: any) => link.password);
  const isActive = link.activeAt ? new Date() < link.activeAt : true;
  const isExpired = link.deleteAt ? new Date() > link.deleteAt : false;
  const hasReachedMaxVisits = link.maxVisits
    ? link.clicks >= link.maxVisits
    : false;

  // TODO: Implement metrics

  if (!isActive || isExpired || !link.isEnabled || hasReachedMaxVisits) {
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
