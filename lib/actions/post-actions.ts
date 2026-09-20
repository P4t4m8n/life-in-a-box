"use server";

// --- Types ---
import { IPostDTO, IPostEditDTO, IPublicPostsQuery } from "@/types/app-types";

// --- Auth ---
import { getSession, requireAdmin } from "@/lib/auth";

// --- Prisma ---
import { prisma } from "@/lib/prisma";
import {
  AccessLevel,
  PostStatus,
  Role,
  UserStatus,
} from "@/generated/prisma/enums";

// next/image throws at render time for hosts outside next.config remotePatterns,
// so a bad URL here would 500 the post page and the homepage hero.
const isAllowedImageSrc = (src: string) => {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
};

export const savePost = async (input: IPostEditDTO): Promise<string> => {
  await requireAdmin();

  const imgSrc = input.imgSrc?.trim() || null;
  if (imgSrc && !isAllowedImageSrc(imgSrc)) {
    throw new Error("Cover image must be a Cloudinary URL (https://res.cloudinary.com/...)");
  }

  const connectOrCreate = input.tags
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      where: { name },
      create: { name },
    }));

  const baseData = {
    title: input.title || "Untitled",
    description: input.description || null,
    readingTime: input.readingTime || null,
    imgSrc,
    imgAlt: input.imgAlt || null,
    content: input.content as object,
  };

  if (input.id) {
    // `set: []` first, so tags removed in the editor are unlinked before reconnecting the rest.
    const post = await prisma.post.update({
      where: { id: input.id },
      data: { ...baseData, tags: { set: [], connectOrCreate } },
    });
    return post.id;
  }

  const post = await prisma.post.create({
    data: { ...baseData, tags: { connectOrCreate } },
  });

  return post.id;
};

// Post data shaped for the editor, including access-level fields the admin UI toggles separately.
export const getPostForEdit = async (
  id: string,
): Promise<IPostEditDTO | null> => {
  await requireAdmin();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    description: post.description,
    readingTime: post.readingTime,
    imgSrc: post.imgSrc,
    imgAlt: post.imgAlt,
    tags: post.tags.map((tag) => tag.name),
    content: post.content,
  };
};

export const getMainPost = async (): Promise<IPostDTO | null> => {
  const mainPost = await prisma.mainPost.findFirst({
    include: {
      post: {
        include: { tags: true },
      },
    },
  });

  if (
    !mainPost ||
    mainPost.post.status !== PostStatus.PUBLISHED ||
    mainPost.post.accessLevel !== AccessLevel.PUBLIC
  )
    return null;

  return mainPost.post;
};

export type PostAccessResult =
  | { status: "ok"; post: IPostDTO }
  | { status: "not-found" }
  | { status: "login-required" };

export const getPostById = async (id: string): Promise<PostAccessResult> => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) return { status: "not-found" };

  const session = await getSession();
  const viewer = session?.user;

  // Admins can preview any post regardless of status/access level.
  if (viewer?.role === Role.ADMIN) return { status: "ok", post };

  if (post.status !== PostStatus.PUBLISHED) return { status: "not-found" };

  if (post.accessLevel === AccessLevel.PRIVATE) return { status: "not-found" };

  if (
    post.accessLevel === AccessLevel.USER &&
    (viewer?.status !== UserStatus.APPROVED || viewer?.role !== Role.USER)
  ) {
    return { status: "login-required" };
  }

  return { status: "ok", post };
};

// Latest published member-only post — used to tease sign-up on the homepage.
// An admin-pinned member-main post takes priority over the latest-by-date fallback.
export const getLatestMemberPost = async () => {
  const pinned = await prisma.mainMemberPost.findFirst({
    include: {
      post: {
        select: {
          id: true,
          title: true,
          description: true,
          imgSrc: true,
          imgAlt: true,
          status: true,
          accessLevel: true,
        },
      },
    },
  });

  if (
    pinned &&
    pinned.post.status === PostStatus.PUBLISHED &&
    pinned.post.accessLevel === AccessLevel.USER
  ) {
    const { id, title, description, imgSrc, imgAlt } = pinned.post;
    return { id, title, description, imgSrc, imgAlt };
  }

  return prisma.post.findFirst({
    where: { status: PostStatus.PUBLISHED, accessLevel: AccessLevel.USER },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      imgSrc: true,
      imgAlt: true,
    },
  });
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

const buildPublicPostsWhere = async (query: IPublicPostsQuery) => {
  const { search, tag } = query;

  const session = await getSession();
  const viewer = session?.user;

  const visibleAccessLevels: AccessLevel[] =
    viewer?.status === UserStatus.APPROVED
      ? [AccessLevel.PUBLIC, AccessLevel.USER]
      : [AccessLevel.PUBLIC];

  return {
    AND: [
      {
        status: PostStatus.PUBLISHED,
        accessLevel: { in: visibleAccessLevels },
      },
      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {},
      tag ? { tags: { some: { name: tag } } } : {},
    ],
  };
};

export const getPublicPosts = async (
  query: IPublicPostsQuery = {},
): Promise<IPostDTO[]> => {
  const { sort = "newest", page, pageSize } = query;

  const where = await buildPublicPostsWhere(query);

  return prisma.post.findMany({
    where,
    include: { tags: true },
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    ...(pageSize
      ? { take: pageSize, skip: ((page ?? 1) - 1) * pageSize }
      : {}),
  });
};

// Total count matching the same filters as getPublicPosts, for pagination controls.
export const countPublicPosts = async (
  query: IPublicPostsQuery = {},
): Promise<number> => {
  const where = await buildPublicPostsWhere(query);
  return prisma.post.count({ where });
};
