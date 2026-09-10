import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";

// --- Actions ---
import { getPostById } from "@/lib/actions/post-actions";

// --- Lib ---
import { contentExtensions } from "@/lib/tiptap-content-extensions";

export async function generateMetadata({
  params,
}: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const result = await getPostById(id);
  if (result.status !== "ok") return {};
  const { post } = result;

  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      images: post.imgSrc ? [{ url: post.imgSrc }] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const result = await getPostById(id);

  if (result.status === "not-found") notFound();
  if (result.status === "login-required") {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/posts/${id}`)}`);
  }

  const { title, readingTime, imgSrc, imgAlt, content } = result.post;

  return (
    <article className="mx-auto w-full max-w-3xl grid gap-4 p-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-extrabold "
      >
        <ArrowRight aria-hidden="true" size={16} />
        <p>חזרה לעמוד הבית</p>
      </Link>

      <h1 className="font-serif text-4xl font-normal px-4">{title}</h1>

      <div className=" inline-flex items-center gap-2 text-xs font-bold text-(--muted)">
        <Clock3 aria-hidden="true" size={15} />
        <p> {readingTime ? `${readingTime} דקות קריאה` : "קריאה קצרה"}</p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-sm">
        <Image
          className="object-cover"
          src={imgSrc || "/open-book.jpg"}
          alt={imgAlt || title}
          fill
          sizes="(max-width: 48rem) 100vw, 30rem"
          priority
        />
      </div>

      <div className="py-4 grid gap-5 leading-[1.8] text-foreground">
        {renderToReactElement({
          extensions: contentExtensions,
          // Stored as the editor's ProseMirror JSON document.
          content: content as object,
        })}
      </div>
    </article>
  );
}
