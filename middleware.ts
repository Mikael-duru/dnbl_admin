import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authCookie = req.cookies.get('auth');

  // Define an array of paths that should be excluded from authentication
  const publicPaths = ['/sign-in', '/api/:path*']; // Add your API paths here

  // Check if the user is trying to access a public path
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next(); // Allow access to public paths
  }

  // Check if the user is trying to access the dashboard
  if (pathname === '/' && !authCookie) {
    return NextResponse.redirect(new URL('/sign-in', req.url)); // Redirect to login
  }

  return NextResponse.next(); // Proceed to the requested page
}

export const config = {
  matcher: ['/'],  // Apply middleware only to the homepage
};