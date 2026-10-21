"use server";

import { revalidatePath } from "next/cache";

// --- Auth ---
import { requireAdmin } from "@/lib/auth";
import { getSession } from "@/lib/auth";

// --- Prisma ---
import { prisma } from "@/lib/prisma";
import type { UserStatus } from "@/generated/prisma/enums";

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

export const deleteOwnAccount = async () => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  await prisma.user.deleteMany({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/profile");
};

export const deleteUserByAdmin = async (userId: string) => {
  await requireAdmin();

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!target || target.email === process.env.ADMIN_EMAIL) return;

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/profile");
};
