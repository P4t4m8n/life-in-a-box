"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AccessLevel, PostStatus } from "@/generated/prisma/enums";

interface AdminPostRow {
  id: string;
  title: string;
  status: PostStatus;
  accessLevel: AccessLevel;
  createdAt: Date;
  isMain: boolean;
  isMainMember: boolean;
  isRecommended: boolean;
}

export const getAdminPosts = async (): Promise<AdminPostRow[]> => {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { mainPost: true, mainMemberPost: true, recomendedPost: true },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    status: post.status,
    accessLevel: post.accessLevel,
    createdAt: post.createdAt,
    isMain: post.mainPost !== null,
    isMainMember: post.mainMemberPost !== null,
    isRecommended: post.recomendedPost !== null,
  }));
};

export const setPostStatus = async (postId: string, status: PostStatus) => {
  await requireAdmin();

  await prisma.post.update({ where: { id: postId }, data: { status } });

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const setPostAccessLevel = async (
  postId: string,
  accessLevel: AccessLevel,
) => {
  await requireAdmin();

  await prisma.post.update({ where: { id: postId }, data: { accessLevel } });

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const setMainPost = async (postId: string) => {
  await requireAdmin();

  // Only one post can be the main post at a time.
  await prisma.$transaction([
    prisma.mainPost.deleteMany({}),
    prisma.mainPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const clearMainPost = async () => {
  await requireAdmin();

  await prisma.mainPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const setMainMemberPost = async (postId: string) => {
  await requireAdmin();

  // Only one post can be the member-teaser main post at a time.
  await prisma.$transaction([
    prisma.mainMemberPost.deleteMany({}),
    prisma.mainMemberPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const clearMainMemberPost = async () => {
  await requireAdmin();

  await prisma.mainMemberPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const setRecommendedPost = async (postId: string) => {
  await requireAdmin();

  // Only one post can be the recommended post at a time.
  await prisma.$transaction([
    prisma.recomendedPost.deleteMany({}),
    prisma.recomendedPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const clearRecommendedPost = async () => {
  await requireAdmin();

  await prisma.recomendedPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
};
