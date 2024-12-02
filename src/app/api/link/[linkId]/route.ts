import { editShortenedLinkSchema } from '@/constants/schemas';
import { getJwtFromHeader } from '@/helpers/getJwtFromHeader';
import { getUserIdFromJWT } from '@/helpers/getUserIdFromJWT';
import {
  deleteLinkById,
  editLinkById,
  getShortenedLinkById
} from '@/lib/server/linkDocument';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const revalidate = 0;

interface Params {
  params: {
    linkId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const linkId = params.linkId;
  const bearerToken = getJwtFromHeader(request.headers.get('Authorization'));
  let userId;
  if (bearerToken) {
    userId = getUserIdFromJWT(bearerToken) ?? undefined;
  }

  const link = await getShortenedLinkById(linkId, userId);

  if (!link || link.creatorId !== userId) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  return NextResponse.json({ link });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const linkId = params.linkId;
  const requestSchema = z.object({
    link: editShortenedLinkSchema
  });

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

  const { success, errors } = await editLinkById(linkId, link);

  if (!success) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const linkId = params.linkId;
  const bearerToken = getJwtFromHeader(request.headers.get('Authorization'));
  let userId;

  if (bearerToken) {
    userId = getUserIdFromJWT(bearerToken) ?? undefined;
  }

  const { errors, success } = await deleteLinkById(linkId, userId);

  if (!success) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
