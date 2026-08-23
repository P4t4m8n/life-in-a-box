import { JsonValue } from "@prisma/client/runtime/client";

export interface IPostDTO {
  id: string;
  title: string;
  content: JsonValue;
  description?: string | null;
  readingTime?: string | null;
  imgSrc?: string | null;
  imgAlt?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: ITagDTO[];
  accessLevel: string;
  mainPost?: string;
  recomendedPost?: string;
  category?: ICategoryDTO | null;
}

export interface ITagDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICategoryDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
