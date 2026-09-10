"use server";

import { revalidatePath } from "next/cache";

// --- Auth ---
import { requireAdmin } from "@/lib/auth";

// --- Prisma ---
import { prisma } from "@/lib/prisma";
import type { AccessLevel, PostStatus } from "@/generated/prisma/enums";

export interface IAdminPostRow {
  id: string;
  title: string;
  status: PostStatus;
  accessLevel: AccessLevel;
  createdAt: Date;
  isMain: boolean;
  isMainMember: boolean;
  isRecommended: boolean;
}

const ADMIN_PAGE_SIZE = 25;

export const getAdminPosts = async (
  page = 1,
): Promise<{ posts: IAdminPostRow[]; totalCount: number; totalPages: number }> => {
  await requireAdmin();

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { mainPost: true, mainMemberPost: true, recommendedPost: true },
      take: ADMIN_PAGE_SIZE,
      skip: (Math.max(1, page) - 1) * ADMIN_PAGE_SIZE,
    }),
    prisma.post.count(),
  ]);

  return {
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      status: post.status,
      accessLevel: post.accessLevel,
      createdAt: post.createdAt,
      isMain: post.mainPost !== null,
      isMainMember: post.mainMemberPost !== null,
      isRecommended: post.recommendedPost !== null,
    })),
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE)),
  };
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
    prisma.recommendedPost.deleteMany({}),
    prisma.recommendedPost.create({ data: { postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const clearRecommendedPost = async () => {
  await requireAdmin();

  await prisma.recommendedPost.deleteMany({});

  revalidatePath("/admin/posts");
  revalidatePath("/");
};

export const deletePost = async (postId: string) => {
  await requireAdmin();

  // clear pin rows first: they FK-reference the post with no cascade delete
  await prisma.$transaction([
    prisma.mainPost.deleteMany({ where: { postId } }),
    prisma.mainMemberPost.deleteMany({ where: { postId } }),
    prisma.recommendedPost.deleteMany({ where: { postId } }),
    prisma.post.delete({ where: { id: postId } }),
  ]);

  revalidatePath("/admin/posts");
  revalidatePath("/");
};
