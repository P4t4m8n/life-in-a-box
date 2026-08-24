"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserStatus } from "@/generated/prisma/enums";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};

export const getAllUsers = async () => {
  await requireAdmin();

  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
};

export const setUserStatus = async (userId: string, status: UserStatus) => {
  await requireAdmin();

  const target = await prisma.user.findUnique({ where: { id: userId } });

  // The env-configured admin's status can't be changed from the dashboard.
  if (!target || target.email === process.env.ADMIN_EMAIL) return;

  await prisma.user.update({ where: { id: userId }, data: { status } });

  revalidatePath("/admin/users");
};
