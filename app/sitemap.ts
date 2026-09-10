import type { MetadataRoute } from "next";

// --- Actions ---
import { getPublishedPostsForSitemap } from "@/lib/actions/post-actions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPostsForSitemap();

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/posts`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
