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

        if (user && await bcrypt.compare(credentials.password as string, user.password as string)) {
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
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      profile(profile) {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          role: "USER" as Role,
        }
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
        }
      }
    }),
  ],
  basePath: "/api/auth",
  session: {
    strategy: 'jwt',
    maxAge: +process.env.NEXTAUTH_SECRET_EXPIRES_IN!
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
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
        token.id = user.id as string;
        token.email = user.email as string;
        token.role = user.role as Role;
        token.username = user.username || null;
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
        // We know the user was created but might not have username or password
        // Let's set defaults
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('Aa123456', salt);

        // Get the email from account if user email is not available
        const account = await db.account.findFirst({
          where: { userId: user.id }
        });

        console.log("FOUND ACCOUNT:", { account });

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
        console.error(error);
      }
    },
    linkAccount: async ({ user, account, profile }) => {
      console.log("LINK ACCOUNT EVENT:", { user, account, profile });

      // If we have user email from the provider but not in our database, update it
      if (profile && user.id) {
        try {
          // Get profile email based on provider
          const email = profile.email;
          const username = profile.username;
          const image = profile.image; 
          const name = profile.name;

          // Find existing user
          const existingUser = await db.user.findUnique({
            where: { id: user.id },
            include: { accounts: true }
          });

          console.log("EXISTING USER FOR LINKING:", { existingUser });

          if (existingUser) {
            // Keep existing username and email if already set
            const updatedData: any = {};

            // Only update fields if they are empty
            if (!existingUser.username && username) {
              updatedData.username = username;
              user.username = username;
            }

            if (!existingUser.email && email) {
              updatedData.email = email;
              user.email = email;
            }

            // Only update name if it's empty
            if (!existingUser.name && name) {
              updatedData.name = name;
              user.name = name;
            }

            // Only update image if the user doesn't already have one
            if (!existingUser.image && image) {
              updatedData.image = image;
              user.image = image;
            }

            // If password is not set, set a default one
            if (!existingUser.password) {
              const salt = await bcrypt.genSalt();
              updatedData.password = await bcrypt.hash('Aa123456', salt);
            }

            // Only update if we have changes to make
            if (Object.keys(updatedData).length > 0) {
              const updated = await db.user.update({
                where: { id: user.id },
                data: updatedData
              });

              console.log("UPDATED USER FROM OAUTH LINK:", { updatedData, updated });
            } else {
              console.log("NO UPDATES NEEDED FOR USER:", user.id);
            }
          }
        } catch (error) {
          console.error("ERROR UPDATING USER FROM OAUTH:", error);
        }
      }
    },
    signIn: async ({ user, account, profile }) => {
      console.log("SIGN IN EVENT:", { user, account, profile });
    }
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
  }
}
