import { Cookies } from '@/constants';
import { createAdminClient } from '@/lib/server/appwrite';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  cookies().set(Cookies.session, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}
