import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/generated/prisma/enums";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
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
      if (isAdmin && (existing.role !== Role.ADMIN || existing.status !== UserStatus.APPROVED)) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { role: Role.ADMIN, status: UserStatus.APPROVED },
        });
      }

      if (existing.status === UserStatus.BANNED || existing.status === UserStatus.REJECTED) {
        return false;
      }

      return true;
    },
    async jwt({ token }) {
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
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? Role.USER;
        session.user.status = token.status ?? UserStatus.PENDING;
      }
      return session;
    },
  },
};

// Defense-in-depth guard for server actions, in case route-level protection is ever bypassed.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
