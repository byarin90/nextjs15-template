import NextAuth, { DefaultSession } from "next-auth"
import "next-auth/jwt"
import bcrypt from "bcrypt"
import Auth0 from "next-auth/providers/auth0"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: PrismaAdapter(db),
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

        if (user && await bcrypt.compare(credentials.password as string, user.password)) {
          return user
        }

        throw new Error("Invalid username or password");
      },
    }),
    Auth0({
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    }),
    GitHub({ 
      clientId: process.env.AUTH_GITHUB_ID!, 
      clientSecret: process.env.AUTH_GITHUB_SECRET! 
    }),
    Google({ 
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! 
    }),
  ],
  basePath: "/api/auth",
  session: {
    strategy: 'jwt',
    maxAge: +process.env.NEXTAUTH_SECRET_EXPIRES_IN!
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.username) {
        user.username = user.email as string;
      }

      if(!user?.password){
        const salt = await bcrypt.genSalt() as any
        user.password = await bcrypt.hash('Aa123456', salt);
      }
      return true;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          role: token.role as Role,
        };
      }
      return session;
    },
  },
  experimental: { enableWebAuthn: true },
  trustHost: true,
})

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
    password?: string | null;
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
    role?: Role;
  }
}
