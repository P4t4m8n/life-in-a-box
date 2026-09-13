import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" — reject anything else
// so this endpoint can't be triggered by random requests.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await prisma.$executeRaw`
    DELETE FROM "RateLimitBucket" WHERE "resetAt" < now() - interval '1 day'
  `;

  return NextResponse.json({ deleted });
}
