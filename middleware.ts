import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle tokens during auth flows and password reset
 * This ensures tokens are preserved between redirects
 */
export function middleware(request: NextRequest) {
  // Only process auth routes
  if (!request.nextUrl.pathname.includes('/auth/') && !request.nextUrl.pathname.includes('/api/auth/')) {
    return NextResponse.next();
  }

  // Extract token from URL parameters
  const url = request.nextUrl.clone();
  const token = url.searchParams.get('token');
  
  // Prevent infinite loops by checking for a special marker
  const processingMarker = url.searchParams.get('_token_processed');
  if (processingMarker) {
    return NextResponse.next();
  }
  
  console.log(`Middleware processing ${url.pathname}, token: ${token ? 'exists' : 'missing'}`);
  
  // Handle reset-password page specially
  if (url.pathname.includes('/reset-password')) {
    if (token) {
      console.log('Token found for reset-password page');
      
      // Add response header to be used later
      const response = NextResponse.next();
      response.headers.set('x-auth-token', token);
      
      return response;
    }
    
    // Check if the token is in a callbackUrl parameter
    const callbackUrl = url.searchParams.get('callbackUrl');
    if (callbackUrl) {
      try {
        const callbackUrlObj = new URL(callbackUrl);
        const tokenFromCallback = callbackUrlObj.searchParams.get('token');
        
        if (tokenFromCallback) {
          console.log('Token found in callbackUrl');
          
          // Add it directly to the current URL
          url.searchParams.set('token', tokenFromCallback);
          url.searchParams.set('_token_processed', 'true'); // Add marker to prevent loops
          return NextResponse.redirect(url);
        }
        
        // Try pattern matching if not found in params
        const tokenMatch = callbackUrl.match(/token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          const extractedToken = decodeURIComponent(tokenMatch[1]);
          console.log(`Token extracted from callbackUrl text: ${extractedToken.substring(0, 10)}...`);
          
          // Add it to the current URL
          url.searchParams.set('token', extractedToken);
          url.searchParams.set('_token_processed', 'true'); // Add marker to prevent loops
          return NextResponse.redirect(url);
        }
      } catch (e) {
        console.error('Failed to parse callbackUrl:', e);
      }
    }
  }
  
  // Handle NextAuth callback
  if (url.pathname.includes('/api/auth/callback/')) {
    // Process callback URLs to ensure tokens are preserved
    const callbackUrl = url.searchParams.get('callbackUrl');
    
    if (callbackUrl && token) {
      try {
        const callbackUrlObj = new URL(callbackUrl);
        
        // If the callback is to the reset-password page, ensure token is passed
        if (callbackUrlObj.pathname.includes('/reset-password')) {
          console.log('Enriching callbackUrl with token for reset-password page');
          
          // Check if token is already in the callbackUrl to prevent unnecessary modifications
          if (!callbackUrlObj.searchParams.has('token')) {
            // Add token to callbackUrl
            callbackUrlObj.searchParams.set('token', token);
            url.searchParams.set('callbackUrl', callbackUrlObj.toString());
            url.searchParams.set('_token_processed', 'true'); // Add marker to prevent loops
            
            return NextResponse.redirect(url);
          }
        }
      } catch (e) {
        console.error('Failed to process callback URL:', e);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/api/auth/:path*'],
};
