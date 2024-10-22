import {
  getLinkByPassword,
  getShortenedLinkByCode
} from '@/lib/server/linkDocument';
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

  // TODO: Implement metrics
  // TODO: Implement has reached max clicks, if so, mark the link as inactive in the ui
  // TODO: Show in the ui the link is inactive if its expired
  // TODO: If the link is inactive because of expired or active date, then show a message to the user that he have to modify the dates to activate the link

  if (!isActive || isExpired || !link.isEnabled) {
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
