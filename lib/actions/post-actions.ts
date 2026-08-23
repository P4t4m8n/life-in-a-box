"use server";

import { IPostDTO } from "@/types/app-types";
import { prisma } from "@/lib/prisma";

export interface SavePostInput {
  title: string;
  description: string;
  readingTime: string;
  imgSrc: string;
  imgAlt: string;
  tags: string[];
  content: unknown;
}

export async function savePost(input: SavePostInput): Promise<string> {
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
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({
            where: { name },
            create: { name },
          })),
      },
    },
  });

  return post.id;
}

export const getMainPost = async (): Promise<IPostDTO | null> => {
  const post = await prisma.post.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    },
  });

  return post;
};

export const getPostById = async (id: string): Promise<IPostDTO | null> => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });
  return post;
};
