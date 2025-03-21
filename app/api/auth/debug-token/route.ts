import { NextResponse } from "next/server";

/**
 * Debug token API - only available in development mode
 * This endpoint has been limited for security reasons
 */
export async function POST(req: Request) {
  // Only allow in development/test environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ 
      error: "Debug API not available in production" 
    }, { status: 403 });
  }
  
  try {
    let token: string | undefined;
    
    // Try to get token from request body
    try {
      const body = await req.json();
      token = body.token;
    } catch {
      // Failed to parse request body
    }
    
    // If no token in body, try request headers
    if (!token) {
      token = req.headers.get('x-auth-token') || 
              req.headers.get('authorization')?.replace('Bearer ', '');
    }
    
    // If still no token, try URL parameters
    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get('token') || undefined;
    }
    
    if (!token) {
      return NextResponse.json({ 
        error: "No token provided" 
      }, { status: 400 });
    }
    
    // Return limited information for security
    return NextResponse.json({
      token: token.substring(0, 5) + "..." + token.substring(token.length - 5),
      length: token.length,
      validFormat: /^[A-Za-z0-9_-]+$/.test(token),
      environment: process.env.NODE_ENV
    });
  } catch {
    return NextResponse.json({
      error: "Server error during token validation"
    }, { status: 500 });
  }
}

/**
 * Debug token API (GET) - only available in development mode
 * This endpoint has been limited for security reasons
 */
export async function GET(req: Request) {
  // Only allow in development/test environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ 
      error: "Debug API not available in production" 
    }, { status: 403 });
  }
  
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ 
      error: "No token provided in query parameters",
      usage: "Add ?token=YOUR_TOKEN to the URL" 
    }, { status: 400 });
  }
  
  // Create a POST request with the token
  const postRequest = new Request(req.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  
  // Forward to the POST handler
  return POST(postRequest);
}
