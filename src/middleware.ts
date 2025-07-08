import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export const config = {
  matcher: '/dashboard/:path*',
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If no session, redirect to login page
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user tries to access admin route without admin role, redirect to user dashboard
  if (pathname.startsWith('/dashboard/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
