import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_PATHNAMES } from './constants';
import { getLoggedInUser } from './lib/server/appwrite-functions/auth';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let [basePathname] = pathname.split('/').slice(1);
  basePathname = `/${basePathname}`;

  const user = await getLoggedInUser();
  // Redirect to dashboard if the user is logged in
  if (AUTH_PATHNAMES.includes(basePathname)) {
    if (user && basePathname !== '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..+$).*)']
};
