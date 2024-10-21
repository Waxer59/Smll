import { getShortenedLinkByCode } from '@/lib/server/linkDocument';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  password: z.string().optional()
});

export async function GET(
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

  if (!isActive || isExpired || !link.isEnabled) {
    notFound();
  }

  if (!havePassword) {
    return NextResponse.json({ link: link.links[0].url }, { status: 200 });
  }
}
