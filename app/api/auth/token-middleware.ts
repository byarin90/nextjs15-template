import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle token extraction and preservation during auth redirects
 * This will extract tokens from original URL or callback URL and add them as
 * script tags to inject into sessionStorage
 */
export function middleware(request: NextRequest) {
  console.log("Token middleware processing:", request.nextUrl.pathname);
  
  // Only process routes related to auth
  if (!request.nextUrl.pathname.includes('/auth/')) {
    return NextResponse.next();
  }

  // Extract token from URL parameters
  const url = request.nextUrl.clone();
  const token = url.searchParams.get('token');
  const tokenInCallbackUrl = extractTokenFromCallbackUrl(url);
  
  if (token || tokenInCallbackUrl) {
    const finalToken = token || tokenInCallbackUrl;
    console.log(`Token middleware found token: ${finalToken?.substring(0, 10)}...`);
    
    // If we're on the reset-password page, augment the response with a script to save token
    if (url.pathname.includes('/reset-password')) {
      const response = NextResponse.next();
      
      // Add script to save token to sessionStorage
      response.headers.set('x-middleware-token', finalToken || '');
      
      return response;
    }
    
    // If redirecting to reset-password, ensure token is preserved
    // Either in the URL params directly or as a hash fragment
    if (url.pathname.includes('/callback/') && url.searchParams.has('callbackUrl')) {
      const callbackUrl = new URL(url.searchParams.get('callbackUrl') || '');
      
      if (callbackUrl.pathname.includes('/reset-password')) {
        // Add token to the callback URL directly
        callbackUrl.searchParams.set('token', finalToken || '');
        url.searchParams.set('callbackUrl', callbackUrl.toString());
        
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

/**
 * Extract token from callbackUrl parameter if present
 */
function extractTokenFromCallbackUrl(url: URL): string | null {
  const callbackUrlParam = url.searchParams.get('callbackUrl');
  if (!callbackUrlParam) return null;
  
  try {
    const callbackUrl = new URL(callbackUrlParam);
    const tokenFromCallback = callbackUrl.searchParams.get('token');
    if (tokenFromCallback) return tokenFromCallback;
    
    // Try text matching if not found in params
    const tokenMatch = callbackUrlParam.match(/token=([^&]+)/);
    if (tokenMatch && tokenMatch[1]) {
      return decodeURIComponent(tokenMatch[1]);
    }
  } catch (error) {
    console.error("Failed to parse callbackUrl:", error);
  }
  
  return null;
}

export const config = {
  matcher: ['/auth/:path*', '/api/auth/:path*'],
};
