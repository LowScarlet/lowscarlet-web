import { NextResponse } from "next/server";
import { db } from "@/db";
import { likes } from "@/db/schema";
import { getIP } from "@/db/queries/visitors";
import { count, eq, desc } from "drizzle-orm";
import { censorIp } from "@/libs/ipUtils";
import { rateLimit } from "@/libs/rateLimit";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const ip = getIP(req);

    // 1. Get total likes count
    const totalLikesResult = await db
      .select({ total: count() })
      .from(likes);
    const totalLikes = totalLikesResult[0]?.total ?? 0;

    // 2. Check if current visitor has liked
    const userLikeResult = await db
      .select()
      .from(likes)
      .where(eq(likes.ipAddress, ip))
      .limit(1);
    const hasLiked = userLikeResult.length > 0;
    const userLikeName = hasLiked ? userLikeResult[0].name : null;

    // 3. Get likes history (newest first)
    const historyRaw = await db
      .select()
      .from(likes)
      .orderBy(desc(likes.createdAt));

    const history = historyRaw.map((like) => ({
      id: like.id,
      name: like.name || censorIp(like.ipAddress),
      createdAt: like.createdAt,
    }));

    return NextResponse.json({
      totalLikes,
      hasLiked,
      userLikeName,
      history,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);

    // Rate limit: max 3 like requests per IP per 30 seconds
    const rl = rateLimit(`like:${ip}`, { limit: 3, windowSeconds: 30 });
    if (!rl.success) {
      return NextResponse.json(
        { error: `Terlalu banyak request. Coba lagi dalam ${rl.retryAfter} detik.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfter),
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || null;

    // Perform upsert on ipAddress
    await db
      .insert(likes)
      .values({
        ipAddress: ip,
        name,
      })
      .onConflictDoUpdate({
        target: likes.ipAddress,
        set: { name },
      });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
