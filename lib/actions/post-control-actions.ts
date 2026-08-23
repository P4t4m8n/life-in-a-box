"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { PostStatus } from "@/generated/prisma/enums";

export interface AdminPostRow {
  id: string;
  title: string;
  status: PostStatus;
  createdAt: Date;
  isMain: boolean;
  isRecommended: boolean;
}

export async function getAdminPosts(): Promise<AdminPostRow[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { mainPost: true, recomendedPost: true },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    status: post.status,
    createdAt: post.createdAt,
    isMain: post.mainPost !== null,
    isRecommended: post.recomendedPost !== null,
  }));
}

export async function setPostStatus(postId: string, status: PostStatus) {
  await prisma.post.update({ where: { id: postId }, data: { status } });

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function setMainPost(postId: string) {
  // Only one post can be the main post at a time.
  await prisma.$transaction([
    prisma.mainPost.deleteMany({}),
    prisma.mainPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function clearMainPost() {
  await prisma.mainPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function setRecommendedPost(postId: string) {
  // Only one post can be the recommended post at a time.
  await prisma.$transaction([
    prisma.recomendedPost.deleteMany({}),
    prisma.recomendedPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function clearRecommendedPost() {
  await prisma.recomendedPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
}
