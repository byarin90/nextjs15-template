import { Role } from "@prisma/client";

declare module 'next-auth' {
  interface User {
    id: string;
    role: Role;
    username?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      username?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: Role;
    username?: string | null;
  }
}
