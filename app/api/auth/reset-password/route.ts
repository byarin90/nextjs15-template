import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import crypto from "crypto";
import { serialize } from "cookie";

// Password reset validation schema
const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, { message: "הסיסמה חייבת להיות לפחות 8 תווים" })
    .max(100, { message: "הסיסמה לא יכולה להיות ארוכה מ-100 תווים" })
    .regex(/[A-Z]/, { message: "הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית" })
    .regex(/[a-z]/, { message: "הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית" })
    .regex(/[0-9]/, { message: "הסיסמה חייבת להכיל לפחות ספרה אחת" }),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Check for middleware token if request has headers
    const middlewareToken = request.headers.get('x-middleware-token');
    if (middlewareToken) {
      body.token = middlewareToken;
    }
    
    // Validate request parameters
    const validationResult = ResetPasswordSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "נתונים לא תקינים", 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { token, password } = validationResult.data;
    
    // Try multiple token formats to find a match
    let verificationToken;
    
    // 1. Try direct token lookup
    verificationToken = await db.verificationToken.findFirst({
      where: {
        token: token,
      },
    });

    // 2. Try with spaces converted to +
    if (!verificationToken) {
      const tokenWithPlus = token.replace(/ /g, '+');
      verificationToken = await db.verificationToken.findFirst({
        where: {
          token: tokenWithPlus,
        },
      });
    }

    // 3. Try URL-decoded token
    if (!verificationToken) {
      try {
        const decodedToken = decodeURIComponent(token);
        verificationToken = await db.verificationToken.findFirst({
          where: {
            token: decodedToken,
          },
        });
      } catch {
        // Ignore decoding errors
      }
    }

    // 4. Try finding by email/identifier if token looks like an email
    if (!verificationToken && token.includes('@')) {
      verificationToken = await db.verificationToken.findFirst({
        where: {
          identifier: token,
        },
      });
    }

    // 5. Try substring matching (last resort)
    if (!verificationToken) {
      // Get recent tokens from the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentTokens = await db.verificationToken.findMany({
        where: {
          expires: {
            gte: oneDayAgo
          }
        },
        orderBy: {
          expires: 'desc'
        },
        take: 10
      });
      
      // Check if any token contains our token or vice versa
      for (const recentToken of recentTokens) {
        if (recentToken.token.includes(token) || token.includes(recentToken.token)) {
          verificationToken = recentToken;
          break;
        }
      }
    }

    // If no verification token found, return error
    if (!verificationToken) {
      return NextResponse.json({ 
        error: "טוקן לא תקף או שפג תוקפו" 
      }, { status: 400 });
    }

    // Check if token has expired
    const tokenExpiry = new Date(verificationToken.expires);
    if (tokenExpiry < new Date()) {
      return NextResponse.json({ 
        error: "הקישור לאיפוס הסיסמה פג תוקף" 
      }, { status: 400 });
    }

    // Find user by email identifier (from verification token)
    const user = await db.user.findFirst({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        error: "לא נמצא משתמש המתאים לטוקן זה" 
      }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with new password
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the verification token so it can't be reused
    try {
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token
          }
        }
      });
    } catch {
      // If deletion fails, we can still continue
      // The token will eventually expire anyway
    }
    
    // Create a JWT token for the user to auto-sign them in
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Session valid for 30 days
    
    // Create a session for the user
    try {
      await db.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: expiresAt,
        },
      });
      
      // Set cookies for the session
      const cookie = serialize("next-auth.session-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      // Create response with cookies
      const response = NextResponse.json({ 
        success: true, 
        message: "הסיסמה אופסה בהצלחה והנך מחובר כעת למערכת" 
      });
      
      response.headers.set("Set-Cookie", cookie);
      return response;
    } catch {
      // Still return success even if auto-login fails, as the password reset worked
      return NextResponse.json({ 
        success: true, 
        message: "הסיסמה אופסה בהצלחה, אך חיבור אוטומטי נכשל" 
      });
    }
  } catch {
    // Generic error for unexpected issues
    return NextResponse.json({ 
      error: "אירעה שגיאה בלתי צפויה בתהליך איפוס הסיסמה" 
    }, { status: 500 });
  }
}
