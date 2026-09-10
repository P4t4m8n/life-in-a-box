"use server";

import { revalidatePath } from "next/cache";

// --- Auth ---
import { requireAdmin } from "@/lib/auth";

// --- Prisma ---
import { prisma } from "@/lib/prisma";

export const getTags = async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return tags;
};

export const createTag = async (name: string) => {
  await requireAdmin();

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 40) {
    throw new Error("Invalid tag name");
  }

  const tag = await prisma.tag.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed },
  });

  revalidatePath("/admin/editor");

  return tag;
};


