import { shortenedLinkSchema } from '@/constants/schemas';
import { getJwtFromHeader } from '@/helpers/getJwtFromHeader';
import { getUserIdFromJWT } from '@/helpers/getUserIdFromJWT';
import {
  createShortenedLink,
  getAllShortenedLinksForUser
} from '@/lib/server/linkDocument';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

interface Params {
  params: {
    linkId: string;
  };
}

const requestSchema = z.object({
  link: shortenedLinkSchema
});

export async function GET(request: NextRequest) {
  const bearerToken = getJwtFromHeader(request.headers.get('authorization'));
  let userId;

  if (bearerToken) {
    userId = getUserIdFromJWT(bearerToken) ?? undefined;
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'You must be logged in to access this endpoint.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    links: await getAllShortenedLinksForUser(userId)
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const bearerToken = getJwtFromHeader(request.headers.get('authorization'));
  let userId;

  if (bearerToken) {
    userId = getUserIdFromJWT(bearerToken) ?? undefined;
  }

  const { error, data } = requestSchema.safeParse({
    link: {
      ...body.link,
      activeAt: body.link?.activeAt ? new Date(body.link.activeAt) : undefined,
      deleteAt: body.link?.deleteAt ? new Date(body.link.deleteAt) : undefined
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { link } = data;

  if (!link) {
    return NextResponse.json({ error: 'Link is required.' }, { status: 400 });
  }

  const { success, errors, shortenedLink } = await createShortenedLink(
    link,
    userId
  );

  if (!success || !shortenedLink) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ ...shortenedLink });
}
