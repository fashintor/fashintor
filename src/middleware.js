import { NextResponse } from 'next/server';

// NOTE: Do not import `verifyToken` from `src/lib/auth.js` here because
// that module uses `jsonwebtoken` which relies on Node's `crypto` module.
// Next.js `middleware` runs in the Edge runtime where Node core modules
// are not available. Instead decode the JWT payload and check the `exp`
// claim to determine whether the token is still valid for redirect logic.

function base64UrlDecode(str) {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  const pad = str.length % 4;
  if (pad === 2) str += '==';
  else if (pad === 3) str += '=';
  else if (pad !== 0) return null;
  try {
    // atob is available in the Edge runtime
    const decoded = atob(str);
    try {
      // Decode percent-encoded UTF-8 bytes
      return decodeURIComponent(
        decoded.split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    } catch (e) {
      return decoded;
    }
  } catch (e) {
    return null;
  }
}

function decodeJwtPayload(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/wallet',
  '/virtual-card',
  '/buy-balance',
  '/order-confirmation',
  '/transactions',
  '/api/wallet',
  '/api/cards',
  '/api/transactions',
];

// Auth routes (redirect to dashboard if already logged in)
// Note: keep `/verify-email` out of this list so users can visit the
// verification page even when they have an auth token (they must be
// allowed to verify their email).
const authRoutes = ['/login', '/register'];

export function middleware(request) {
  const rawToken = request.cookies.get('auth-token')?.value;
  const token = rawToken && rawToken.length > 10 ? rawToken : null;
  // Determine token validity using exp claim only (edge-safe).
  let validToken = null;
  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && payload.exp && typeof payload.exp === 'number') {
      // exp is in seconds since epoch
      if (payload.exp * 1000 > Date.now()) {
        validToken = payload;
      }
    }
  }
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to login if protected route and no token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if auth route and has a valid token
  if (isAuthRoute && validToken) {
    return NextResponse.redirect(new URL('/dashboard/wallet', request.url));
  }

  // Stale/empty cookie on login/register — clear it so logout state is consistent
  if (isAuthRoute && rawToken && !validToken) {
    const response = NextResponse.next();
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/wallet/:path*',
    '/virtual-card/:path*',
    '/buy-balance/:path*',
    '/order-confirmation/:path*',
    '/transactions',
    '/transactions/:path*',
    '/login',
    '/register',
    '/api/wallet/:path*',
    '/api/cards/:path*',
    '/api/transactions/:path*',
  ],
};