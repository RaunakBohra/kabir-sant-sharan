import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/lib/i18n-config';
import { securityConfig, isDevelopment, isProduction } from '@/lib/config';

function getLocale(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Check if the pathname starts with a locale
  const localeInPath = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (localeInPath) {
    return localeInPath;
  }

  if (pathnameIsMissingLocale) {
    // Try to get locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase())
        .find(lang => {
          // Check for exact match or language family match
          return i18n.locales.some(locale =>
            locale === lang || lang.startsWith(locale.split('-')[0])
          );
        });

      if (preferredLocale && i18n.locales.includes(preferredLocale as any)) {
        return preferredLocale as typeof i18n.locales[number];
      }
    }

    return i18n.defaultLocale;
  }

  return null;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // HSTS only in production
  if (isProduction) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: unsafe-* needed for Next.js dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // CORS Headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = securityConfig.cors.origins;

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (isDevelopment) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Trace-ID');
    response.headers.set('Access-Control-Expose-Headers', 'X-Trace-ID, X-RateLimit-Limit, X-RateLimit-Remaining');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle preflight OPTIONS requests for CORS
  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const response = new NextResponse(null, { status: 200 });
    return addSecurityHeaders(response, request);
  }

  // Skip locale middleware for API routes, static files, and auth routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/admin'
  ) {
    const response = NextResponse.next();
    return addSecurityHeaders(response, request);
  }

  const locale = getLocale(request);
  let response: NextResponse;

  if (locale && locale !== i18n.defaultLocale) {
    // If we have a non-default locale and it's not in the URL, redirect
    if (!pathname.startsWith(`/${locale}`)) {
      response = NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      );
    } else {
      response = NextResponse.next();
    }
  } else if (locale === i18n.defaultLocale && pathname.startsWith(`/${i18n.defaultLocale}`)) {
    // If we have the default locale in the URL, redirect to remove it
    const newPathname = pathname.replace(`/${i18n.defaultLocale}`, '') || '/';
    response = NextResponse.redirect(
      new URL(newPathname, request.url)
    );
  } else {
    response = NextResponse.next();
  }

  return addSecurityHeaders(response, request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (auth page)
     * - admin (admin panel)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|admin).*)',
  ],
};