"use server";

import { getServerSession } from "next-auth";

import { IPostDTO, IPostEditDTO, IPublicPostsQuery } from "@/types/app-types";
import { authOptions, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AccessLevel,
  PostStatus,
  Role,
  UserStatus,
} from "@/generated/prisma/enums";

export const savePost = async (input: IPostEditDTO): Promise<string> => {
  await requireAdmin();

  const post = await prisma.post.create({
    data: {
      title: input.title || "Untitled",
      description: input.description || null,
      readingTime: input.readingTime || null,
      imgSrc: input.imgSrc || null,
      imgAlt: input.imgAlt || null,
      content: input.content as object,
      tags: {
        connectOrCreate: input.tags
          .map((tag) => tag.name.trim())
          .filter(Boolean)
          .map((name) => ({
            where: { name },
            create: { name },
          })),
      },
    },
  });

  return post.id;
};

export const getMainPost = async (): Promise<IPostDTO | null> => {
  const mainPost = await prisma.mainPost.findFirst({
    include: {
      post: {
        include: { tags: true },
      },
    },
  });

  if (!mainPost || mainPost.post.status !== PostStatus.PUBLISHED) return null;

  return mainPost.post;
};

export const getPostById = async (id: string): Promise<IPostDTO | null> => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) return null;

  const session = await getServerSession(authOptions);
  const viewer = session?.user;

  // Admins can preview any post regardless of status/access level.
  if (viewer?.role === Role.ADMIN) return post;

  if (post.status !== PostStatus.PUBLISHED) return null;

  if (post.accessLevel === AccessLevel.PRIVATE) return null;

  if (
    post.accessLevel === AccessLevel.USER &&
    (viewer?.status !== UserStatus.APPROVED || viewer?.role !== Role.USER)
  ) {
    return null;
  }

  return post;
};

// Public, published posts only — used to build the sitemap.
export const getPublishedPostsForSitemap = async (): Promise<
  { id: string; updatedAt: Date }[]
> => {
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED, accessLevel: AccessLevel.PUBLIC },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
};

export const getPublicPosts = async (
  query: IPublicPostsQuery = {},
): Promise<IPostDTO[]> => {
  const { search, tag, sort = "newest" } = query;

  const session = await getServerSession(authOptions);
  const viewer = session?.user;
  const isAdmin = viewer?.role === Role.ADMIN;

  const visibleAccessLevels: AccessLevel[] =
    viewer?.status === UserStatus.APPROVED
      ? [AccessLevel.PUBLIC, AccessLevel.USER]
      : [AccessLevel.PUBLIC];

  return prisma.post.findMany({
    where: {
      AND: [
        isAdmin
          ? {}
          : {
              status: PostStatus.PUBLISHED,
              accessLevel: { in: visibleAccessLevels },
            },
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        tag ? { tags: { some: { name: tag } } } : {},
      ],
    },
    include: { tags: true },
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
  });
};
