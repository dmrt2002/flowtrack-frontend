import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)',
  '/forgot-password(.*)',
  '/auth/reset-password(.*)',
  '/auth/verify-email(.*)',
  '/api/webhooks(.*)', // Clerk webhooks
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through - backend handles authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Check for native auth token (cookie-based)
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!userId || !!accessToken;

  // Public routes handling
  if (isPublicRoute(request)) {
    // If already logged in, redirect to appropriate page
    if (isAuthenticated) {
      const onboardingComplete =
        request.cookies.get('onboarding_complete')?.value === 'true';
      if (onboardingComplete) {
        return NextResponse.redirect(new URL('/dashboard-home', request.url));
      } else {
        return NextResponse.redirect(
          new URL('/onboarding/form-builder', request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // Protected routes (auth required)
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check onboarding status
  const onboardingComplete =
    request.cookies.get('onboarding_complete')?.value === 'true';

  // If onboarding not complete, redirect to onboarding
  if (!onboardingComplete && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(
      new URL('/onboarding/form-builder', request.url)
    );
  }

  // If onboarding complete, redirect away from onboarding
  if (onboardingComplete && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard-home', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
