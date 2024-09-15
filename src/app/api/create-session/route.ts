import { Cookies } from '@/constants';
import {
  createAdminClient,
  getUserById,
  updateUserPrefs
} from '@/lib/server/appwrite';
import { UserPrefs } from '@/types';
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

  // check if user is first time user
  const { prefs } = await getUserById(userId);

  // If the user doesn't have any preferences then its a first time user
  if (Object.keys(prefs).length === 0) {
    await updateUserPrefs(userId, { [UserPrefs.isFirstTimeUser]: true });
  }

  cookies().set(Cookies.session, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}
