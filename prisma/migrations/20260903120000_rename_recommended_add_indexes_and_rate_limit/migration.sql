-- Rename RecomendedPost -> RecommendedPost (fixes typo, preserves any existing pinned row)
ALTER TABLE "RecomendedPost" RENAME TO "RecommendedPost";
ALTER TABLE "RecommendedPost" RENAME CONSTRAINT "RecomendedPost_pkey" TO "RecommendedPost_pkey";
ALTER INDEX "RecomendedPost_postId_key" RENAME TO "RecommendedPost_postId_key";
ALTER TABLE "RecommendedPost" RENAME CONSTRAINT "RecomendedPost_postId_fkey" TO "RecommendedPost_postId_fkey";

-- Indexes to speed up common Post listing/filtering queries
CREATE INDEX "Post_status_accessLevel_idx" ON "Post"("status", "accessLevel");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- Backing store for the rate limiter (needed for serverless/multi-instance deploys,
-- since in-memory counters don't survive across cold starts or separate instances)
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);
