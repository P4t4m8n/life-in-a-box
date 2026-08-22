"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return tags;
}

export async function createTag(name: string) {
  const tag = await prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });

  revalidatePath("/admin/editor");

  return tag;
}
