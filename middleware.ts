import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication
  const accessToken = request.cookies.get('accessToken')?.value;

  // Public routes (no auth required)
  const publicRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If already logged in, redirect to appropriate page
    if (accessToken) {
      const onboardingComplete =
        request.cookies.get('onboarding_complete')?.value === 'true';
      if (onboardingComplete) {
        return NextResponse.redirect(new URL('/dashboard-home', request.url));
      } else {
        return NextResponse.redirect(
          new URL('/onboarding/strategy', request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // Protected routes (auth required)
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check onboarding status
  const onboardingComplete =
    request.cookies.get('onboarding_complete')?.value === 'true';

  // If onboarding not complete, redirect to onboarding
  if (!onboardingComplete && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding/strategy', request.url));
  }

  // If onboarding complete, redirect away from onboarding
  if (onboardingComplete && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard-home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
