import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_PATHNAMES, PRIVATE_PATHNAMES } from './constants';
import { getLoggedInUser } from './lib/server/appwrite-functions/auth';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let [basePathname] = pathname.split('/').slice(1);
  basePathname = `/${basePathname}`;

  const user = await getLoggedInUser();

  const isAuthPath = AUTH_PATHNAMES.some((authPath) =>
    basePathname.includes(authPath)
  );
  const isPrivatePath = PRIVATE_PATHNAMES.some((privatePath) =>
    basePathname.includes(privatePath)
  );

  // Redirect to login if the user is not logged in and tries to access a private route
  if (isPrivatePath && !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to dashboard if the user is logged in
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..+$).*)']
};
