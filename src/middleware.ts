'use client';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './lib/server/appwrite';
import { PROTECTED_PATHNAMES, PUBLIC_PATHNAMES } from './constants';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let [basePathname] = pathname.split('/').slice(1);
  basePathname = `/${basePathname}`;

  const user = await getLoggedInUser();

  // Redirect to dashboard it the user is logged in
  if (PUBLIC_PATHNAMES.includes(basePathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (PROTECTED_PATHNAMES.includes(basePathname)) {
    console.log(cookies());
    // Redirect to base url if the user is not logged in
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}
