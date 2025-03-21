import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";
import bcrypt from "bcrypt";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "./lib/email";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    username?: string;
    password: string;
  }
}

declare module "next-auth" {
  interface User {
    role: Role;
    username?: string | null;
  }
  
  interface Session {
    user: {
      id?: string;
      email?: string;
      username?: string;
      role: Role;
    } & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    username?: string | null;
    id: string;
    email: string;
  }
}

// const DEFAULT_PASSWORD = 'Aa123456';
const AUTH_DEBUG = true;
const SESSION_MAX_AGE = +process.env.NEXTAUTH_SECRET_EXPIRES_IN!;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  debug: AUTH_DEBUG,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email or Username",
          type: "text",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const username = credentials.username as string;
        const password = credentials.password as string;
        
        // Check if username is email or not
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: { equals: username, mode: 'insensitive' } },
              { username: { equals: username, mode: 'insensitive' } }
            ]
          }
        });
        
        if (!user || !user.password) return null;
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          emailVerified: user.emailVerified,
          image: user.image,
        };
      }
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        secure: process.env.SMTP_SECURE === 'true',
      },
      from: process.env.SMTP_FROM,

      /**
       * This function is called when a user requests a password reset or email verification.
       * It's responsible for sending an email with a verification link.
       */
      async sendVerificationRequest({ identifier: email, url, token }) {
        console.log("\n======= VERIFICATION REQUEST STARTED =======");
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`Email: ${email}`);
        console.log(`Original URL: ${url}`);
        console.log(`Original Token: ${token?.substring(0, 10)}...`);
        
        // Check if this is a reset password request (by looking at URL path)
        const originalUrl = new URL(url);
        const callbackUrl = new URL(originalUrl.searchParams.get('callbackUrl') || '');
        const isPasswordReset = callbackUrl.pathname.includes('reset-password');
        
        console.log(`Is Reset Password Request: ${isPasswordReset}`);
        
        // Log URL analysis details
        console.log("\n----- URL ANALYSIS -----");
        console.log(`Protocol: ${originalUrl.protocol}`);
        console.log(`Host: ${originalUrl.host}`);
        console.log(`Pathname: ${originalUrl.pathname}`);
        console.log(`Search (raw): ${originalUrl.search}`);
        
        // Log parameter analysis
        console.log("\n----- URL PARAMETERS -----");
        for (const [key, value] of originalUrl.searchParams.entries()) {
          if (key === 'callbackUrl') {
            console.log(`URL Parameter: ${key} = ${value.substring(0, 30)}... (${value.length} chars)`);
            // Check if token already exists in callbackUrl
            const callbackUrlObj = new URL(value);
            const hasTokenInCallback = callbackUrlObj.searchParams.has("token");
            console.log(`${hasTokenInCallback ? 'Found' : 'No'} token parameter in callbackUrl`);
          } else if (key === 'token') {
            console.log(`URL Parameter: ${key} = ${value.substring(0, 20)}... (${value.length} chars)`);
          } else {
            console.log(`URL Parameter: ${key} = ${value}`);
          }
        }
        
        // Log detailed verification request information
        console.log("\n----- VERIFICATION REQUEST DETAILS -----");
        console.log(`Original URL: ${url}`);
        console.log(`Is Reset Password Request: ${isPasswordReset}`);
        console.log(`Original token: ${token}`);
        console.log(`URL Protocol: ${originalUrl.protocol}`);
        console.log(`URL Host: ${originalUrl.host}`);
        console.log(`URL Pathname: ${originalUrl.pathname}`);
        console.log(`URL Search: ${originalUrl.search}`);
        
        for (const [key, value] of originalUrl.searchParams.entries()) {
          const displayValue = value.length > 30 ? value.substring(0, 30) + "..." : value;
          console.log(`URL Param: ${key} = ${displayValue}`);
        }
        
        // If this is a password reset request, we need to modify the callback URL
        // to include the token as a query parameter
        if (isPasswordReset && callbackUrl) {
          console.log(`\n----- MODIFYING CALLBACK URL TO INCLUDE TOKEN -----`);
          // Don't add token if already present
          if (!callbackUrl.searchParams.has("token")) {
            callbackUrl.searchParams.set("token", token);
            console.log(`Modified callbackUrl: ${callbackUrl.toString()}`);
            
            // Update the original URL with the modified callbackUrl
            originalUrl.searchParams.set("callbackUrl", callbackUrl.toString());
            console.log(`Updated original URL with token-enriched callbackUrl: ${originalUrl.toString()}`);
            
            // Update the url variable for the rest of the function
            const modifiedUrl = originalUrl.toString();
            
            // Before sending email, make sure this token is properly stored in the database
            try {
              const existingToken = await db.verificationToken.findFirst({
                where: { token }
              });
              
              if (!existingToken) {
                console.log("Creating verification token record in database");
                await db.verificationToken.create({
                  data: {
                    identifier: email,
                    token,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                  }
                });
                console.log("Verification token created successfully");
              } else {
                console.log("Token already exists in database");
              }
              
              // Now we can send the email with the modified URL
              await sendPasswordResetEmail(email, modifiedUrl);
              console.log(`Email sent successfully`);
              return;
            } catch (error) {
              console.error(`Error sending verification email:`, error);
              throw new Error(`Error sending verification email: ${error}`);
            }
          } else {
            console.log(`Token already present in callbackUrl`);
          }
        }
        
        // If we reach here, either it's not a password reset or we didn't modify the URL
        try {
          await sendPasswordResetEmail(email, url);
          console.log(`Email sent successfully`);
        } catch (error) {
          console.error(`Error sending verification email:`, error);
          throw new Error(`Error sending verification email: ${error}`);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER" as Role,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      profile(profile) {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          role: "USER" as Role,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username || null;
        token.email = user.email || "";
        token.role = user.role;
        token.id = user.id || ""; 
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username || undefined;
      }
      return session;
    },
    signIn() {
      return true;
    }
  },
  events: {
    createUser: async ({ user }) => {
      if (!user.id) return;

      try {
        // Create initial hashed password
        const hashedPassword = await bcrypt.hash("Aa123456", 10);

        const updatedUser = await db.user.update({
          where: { id: user.id },
          data: {
            email: user.email,
            username: user.username || user.email,
            password: hashedPassword
          }
        });

        console.log("UPDATED USER:", { updatedUser });
      } catch (error) {
        console.error("ERROR IN CREATE USER EVENT:", error);
      }
    },
    linkAccount: async ({ user, profile }) => { 
      if (!profile || !user.id) return;

      try {
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
          include: { accounts: true }
        });

        if (!existingUser) return;

        const updateFields = [
          { field: 'username', value: profile.username, current: existingUser.username },
          { field: 'email', value: profile.email, current: existingUser.email },
          { field: 'name', value: profile.name, current: existingUser.name },
          { field: 'image', value: profile.image, current: existingUser.image }
        ];

        const updatedData = updateFields.reduce((acc, { field, value, current }) => {
          if (!current && value) {
            acc[field] = value;
            (user as any)[field] = value;
          }
          return acc;
        }, {} as Record<string, string>);

        if (Object.keys(updatedData).length > 0) {
          const updated = await db.user.update({
            where: { id: user.id },
            data: updatedData
          });
          console.log("UPDATED USER FROM OAUTH LINK:", { updatedData, updated });
        }
      } catch (error) {
        console.error("ERROR UPDATING USER FROM OAUTH:", error);
      }
    },
    signIn: async ({ user, account, profile }) => {
      console.log("SIGN IN EVENT:", { user, account, profile });
    }
  },
});
