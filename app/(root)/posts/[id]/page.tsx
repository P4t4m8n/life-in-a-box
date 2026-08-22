import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";

import { StickerBadge } from "@/components/sticker-badge";
import { articles, getArticleById } from "@/lib/fixtures/articles";
import { getPostById } from "@/lib/actions/post-actions";
import { contentExtensions } from "@/lib/tiptap-content-extensions";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article._id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [{ url: article.imgSrc }],
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <article className="p-4 w-full grid gap-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-extrabold "
      >
        <ArrowRight aria-hidden="true" size={16} />
        <p>חזרה לעמוד הבית</p>
      </Link>

      <StickerBadge tone="leaf" className="">
        {"fdsfsdfsd"}
      </StickerBadge>

      <h1 className="font-serif text-4xl font-normal px-4">{post.title}</h1>

      <div className=" inline-flex items-center gap-2 text-xs font-bold text-(--muted)">
        <Clock3 aria-hidden="true" size={15} />
        <p>{post.readingTime}</p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-sm">
        <Image
          className="object-cover"
          src={post.imgSrc!}
          alt={post.imgAlt!}
          fill
          sizes="(max-width: 48rem) 100vw, 44rem"
          priority
        />
      </div>

      <div className="py-4 grid gap-5 leading-[1.8] text-foreground">
        {renderToReactElement({
          extensions: contentExtensions,
          // Stored as the editor's ProseMirror JSON document.
          content: post.content as object,
        })}
      </div>
    </article>
  );
}
