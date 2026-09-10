import { JsonValue } from "@prisma/client/runtime/client";

export interface IPostDTO extends Omit<IPostEditDTO, "tags"> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: ITagDTO[];
  accessLevel: string;
  category?: ICategoryDTO | null;
}

export interface IPostEditDTO {
  id?: string;
  title: string;
  description?: string | null;
  readingTime?: string | null;
  imgSrc?: string | null;
  imgAlt?: string | null;
  tags: string[];
  content: JsonValue;
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


export interface IPublicPostsQuery {
  search?: string;
  tag?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}