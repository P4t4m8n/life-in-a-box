import { encode } from "next-auth/jwt";
import type { Role, UserStatus } from "@/generated/prisma/enums";

type SessionUser = {
  id: string;
  role: Role;
  status: UserStatus;
  email: string;
  name?: string | null;
};

// Signs a real next-auth v4 JWT so tests can log in as any seeded user without
// ever touching the actual Google OAuth flow.
export async function createSessionCookie(user: SessionUser, baseURL: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set for the e2e run");

  const value = await encode({
    token: {
      sub: user.id,
      id: user.id,
      role: user.role,
      status: user.status,
      email: user.email,
      name: user.name,
    },
    secret,
  });

  return {
    name: "next-auth.session-token",
    value,
    url: baseURL,
    httpOnly: true,
    sameSite: "Lax" as const,
    expires: Math.floor(Date.now() / 1000) + 60 * 60,
  };
}
