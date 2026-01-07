import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get the user from localStorage (client-side only, so we check from cookies or headers)
  // Since middleware runs on the server, we'll check for auth token in cookies
  const isAuthenticated = request.cookies.get('auth-user')?.value;

  // Routes that don't require authentication
  const publicRoutes = ['/welcome', '/auth/signin', '/auth/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If trying to access protected route without auth, redirect to welcome
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }

  // If authenticated and trying to access welcome/auth pages, redirect to home
  if (isAuthenticated && (pathname === '/welcome' || pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
