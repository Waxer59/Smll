import { createSessionClient } from '@/lib/server/appwrite';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  const { account } = await createSessionClient();

  await account.updateVerification(userId, secret);

  return NextResponse.redirect(
    `${request.nextUrl.origin}/dashboard?verified=true`
  );
}
