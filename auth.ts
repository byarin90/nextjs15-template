import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";
import bcrypt from "bcrypt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";

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
    accessToken?: string;
    user: {
      id?: string;
      email?: string;
      username?: string;
      role: Role;
    } & DefaultSession["user"];
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

const DEFAULT_PASSWORD = 'Aa123456';
const AUTH_DEBUG = !!process.env.AUTH_DEBUG;
const SESSION_MAX_AGE = +process.env.NEXTAUTH_SECRET_EXPIRES_IN!;
const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  // Core configuration
  debug: AUTH_DEBUG,
  adapter: PrismaAdapter(db),
  secret: AUTH_SECRET,
  basePath: "/api/auth",
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  experimental: { enableWebAuthn: true },
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username as string },
        });

        const isValidPassword = user &&
          await bcrypt.compare(credentials.password as string, user.password as string);

        if (isValidPassword) return user;
        throw new Error("Invalid username or password");
      },
    }),
    GitHub({
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
      }
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
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        Object.assign(token, {
          id: user.id as string,
          email: user.email as string,
          role: user.role as Role,
          username: user.username || null
        });
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          role: token.role,
          username: token.username || undefined,
        };
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      console.log("CREATE USER EVENT TRIGGERED:", { user });

      try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        const updatedUser = await db.user.update({
          where: { id: user.id },
          data: {
            email: user.email,
            username: user.email || user.username,
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

        if (!existingUser.password) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
          updatedData.password = hashedPassword;
        }

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
