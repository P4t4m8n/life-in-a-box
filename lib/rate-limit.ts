import { prisma } from "@/lib/prisma";

/**
 * Returns true if the call is allowed, false if `key` has exceeded `limit`
 * calls within the trailing `windowMs` window.
 *
 * Backed by a Postgres table (not in-memory) because this app runs on
 * serverless/edge infrastructure. separate instances/cold starts dont share
 * process memory, so an in memory counter would silently stop limiting
 * anything under real traffic. The upsert below is a single atomic
 * statement, so concurrent requests for the same key can't race each other.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
    VALUES (${key}, 1, now() + (${windowMs}::float8 * interval '1 millisecond'))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "resetAt" < now() THEN 1 ELSE "count" + 1 END,
      "resetAt" = CASE
        WHEN "resetAt" < now() THEN now() + (${windowMs}::float8 * interval '1 millisecond')
        ELSE "resetAt"
      END
    RETURNING "count"
  `;

  return rows[0].count <= limit;
}

