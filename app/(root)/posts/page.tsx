import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Metadata } from "next";

import { StickerBadge } from "@/components/sticker-badge";
import { PostsFilterBar } from "@/components/posts-filter-bar";
import { getPublicPosts } from "@/lib/actions/post-actions";
import { getTags } from "@/lib/actions/tags-actions";
import { IPostDTO } from "@/types/app-types";

export const metadata: Metadata = {
  title: "כל הפוסטים",
  alternates: { canonical: "/posts" },
};

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const sort = params.sort === "oldest" ? "oldest" : "newest";

  const [posts, tags] = await Promise.all([
    getPublicPosts({ search, tag, sort }),
    getTags(),
  ]);

  return (
    <div className="grid px-4 py-12 gap-8">
      <StickerBadge tone="leaf">פוסטים</StickerBadge>
      <h1 className=" font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-normal">
        כול השטויות במקום אחד
      </h1>

      <PostsFilterBar tags={tags.map((t) => t.name)} />

      {posts.length === 0 ? (
        <p className="py-16 text-center text-(--muted)">
          לא נמצאו רשימות מתאימות.
        </p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}

const PostList = ({ posts }: { posts: IPostDTO[] }) => {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, idx) => (
        <PostPreview key={post.id} post={post} idx={idx} />
      ))}
    </ul>
  );
};

const cardRotations = ["-rotate-2", "rotate-2"];

const PostPreview = ({ post, idx }: { post: IPostDTO; idx: number }) => {
  const { id, title, description, imgSrc, imgAlt, readingTime } = post;
  return (
    <li className={cardRotations[idx % cardRotations.length]}>
      <article
        className="group grid gap-2 relative min-w-0 overflow-hidden rounded-sm 
      border-2 border-white bg-white p-3 shadow-md transition-transform duration-300 hover:rotate-0 hover:shadow-lg"
      >
        <Link href={`/posts/${id}`} aria-label={title}>
          <div className="relative aspect-video overflow-hidden bg-(--sky)">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              src={imgSrc || "/open-book.jpg"}
              alt={imgAlt || title}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </div>
          <div className="px-1 pt-4 pb-1">
            <h2 className="mt-2 mb-3 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] font-normal">
              {title}
            </h2>
            <p className="leading-[1.7] text-(--muted)">{description}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-(--muted)">
              <Clock3 aria-hidden="true" size={15} />
              <p> {readingTime ? `${readingTime} דקות קריאה` : "קריאה קצרה"}</p>
            </div>
          </div>
        </Link>
      </article>
    </li>
  );
};
