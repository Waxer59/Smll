import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './lib/server/appwrite';
import { PUBLIC_PATHNAMES } from './constants';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let [basePathname] = pathname.split('/').slice(1);
  basePathname = `/${basePathname}`;

  const user = await getLoggedInUser();

  // Redirect to dashboard if the user is logged in
  if (PUBLIC_PATHNAMES.includes(basePathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
}
