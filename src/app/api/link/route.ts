import { shortenedLinkSchema } from '@/constants/schemas';
import { createShortenedLink } from '@/lib/server/linkDocument';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  link: shortenedLinkSchema
});

// TODO: Implement JWT authentication in all routes
// TODO: Implement GET all links method
export async function GET(request: NextRequest) {}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { error, data } = requestSchema.safeParse({
    link: {
      ...body.link,
      activeAt: body.link.activeAt ? new Date(body.link.activeAt) : undefined,
      deleteAt: body.link.deleteAt ? new Date(body.link.deleteAt) : undefined
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { link } = data;

  if (!link) {
    return NextResponse.json({ error: 'Link is required.' }, { status: 400 });
  }

  const { success, errors, shortenedLink } = await createShortenedLink(link);

  if (!success || !shortenedLink) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ ...shortenedLink });
}
