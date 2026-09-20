// --- React ---
import { cache } from "react";

// --- NextAuth ---
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// --- NextAuth Types ---
import type { NextAuthOptions, Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

// --- Lib ---
import { env } from "@/lib/env";

// --- Prisma ---
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/generated/prisma/enums";

const ADMIN_EMAIL = env.ADMIN_EMAIL;

const signInCallback = async ({ user }: { user: User | AdapterUser }) => {
  if (!user.email) return false;

  const isAdmin = user.email === ADMIN_EMAIL;
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        image: user.image,
        role: isAdmin ? Role.ADMIN : Role.USER,
        status: isAdmin ? UserStatus.APPROVED : UserStatus.PENDING,
      },
    });
    return true;
  }

  // Keep the env-configured admin permanently approved, even if it was previously changed.
  if (
    isAdmin &&
    (existing.role !== Role.ADMIN || existing.status !== UserStatus.APPROVED)
  ) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: Role.ADMIN, status: UserStatus.APPROVED },
    });
  }

  if (
    existing.status === UserStatus.BANNED ||
    existing.status === UserStatus.REJECTED
  ) {
    return false;
  }

  return true;
};

const jwtCallback = async ({ token }: { token: JWT }) => {
  if (!token.email) return token;

  const dbUser = await prisma.user.findUnique({
    where: { email: token.email },
  });

  if (dbUser) {
    token.id = dbUser.id;
    token.role = dbUser.role;
    token.status = dbUser.status;
  }

  return token;
};

const sessionCallback = async ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) => {
  if (session.user) {
    session.user.id = token.id ?? "";
    session.user.role = token.role ?? Role.USER;
    session.user.status = token.status ?? UserStatus.PENDING;
  }
  return session;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: signInCallback,
    jwt: jwtCallback,
    session: sessionCallback,
  },
};

// Deduped per request: the header, the page, and every server action that reads the
// session share one JWT decode + one User lookup instead of repeating them.
export const getSession = cache(() => getServerSession(authOptions));

// Defense-in-depth guard for server actions, in case route-level protection is ever bypassed.
export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
