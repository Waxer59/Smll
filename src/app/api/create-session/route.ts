import { Cookies } from '@/constants';
import { createAdminClient } from '@/lib/server/appwrite';
import {
  getUserById,
  updateName
} from '@/lib/server/appwrite-functions/account';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  const { account } = await createAdminClient();
  let session = null;

  try {
    session = await account.createSession(userId, secret);
  } catch (error) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  cookies().set(Cookies.session, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  });

  const { email, name } = await getUserById(userId);
  const [emailName] = email.split('@');

  // If the user dont have a name, update it with the email
  if (name.trim().length === 0) {
    updateName(emailName);
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}
