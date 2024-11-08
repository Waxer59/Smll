import { getUserIdFromJWT } from '@/helpers/getUserIdFromJWT';
import { deleteLinkById } from '@/lib/server/linkDocument';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    linkId: string;
  };
}

export async function GET(request: NextRequest, params: Params) {}

export async function PATCH(request: NextRequest, params: Params) {}

export async function DELETE(request: NextRequest, { params }: Params) {
  const linkId = params.linkId;
  const bearerToken = request.headers.get('Authorization');
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
