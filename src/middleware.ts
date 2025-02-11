import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_PATHNAMES } from './constants';
import { getLoggedInUser } from './lib/server/appwrite-functions/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let [basePathname] = pathname.split('/').slice(1);
  basePathname = `/${basePathname}`;

  const user = await getLoggedInUser();

  // Redirect to dashboard if the user is logged in
  if (AUTH_PATHNAMES.includes(basePathname)) {
    const isMfaRoute =
      basePathname === '/mfa' || basePathname === '/mfa-recovery';

    if (isMfaRoute && user === 'MFA') {
      return;
    } else if (user === 'MFA') {
      return NextResponse.redirect(new URL('/mfa', request.url));
    } else if (user && basePathname !== '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
