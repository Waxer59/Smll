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

  const { errors, success } = await deleteLinkById(linkId);

  if (!success) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
