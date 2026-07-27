import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { getIP } from "@/db/queries/visitors";
import { desc, eq } from "drizzle-orm";
import { censorIp } from "@/libs/ipUtils";
import { cookies } from "next/headers";
import crypto from "crypto";
import { rateLimit } from "@/libs/rateLimit";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const list = await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const formattedList = list.map((comment) => ({
      id: comment.id,
      name: comment.name || censorIp(comment.ipAddress),
      message: comment.message,
      createdAt: comment.createdAt,
    }));

    return NextResponse.json(formattedList);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);

    // Rate limit: max 5 comments per IP per 60 seconds
    const rl = rateLimit(`comment:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: `Terlalu banyak komentar. Coba lagi dalam ${rl.retryAfter} detik.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.retryAfter),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || null;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Pesan terlalu panjang (maks. 500 karakter)." }, { status: 400 });
    }

    await db.insert(comments).values({
      ipAddress: ip,
      name,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const expectedToken = crypto
      .createHash("sha256")
      .update(adminPassword)
      .digest("hex");

    const isAuthorized = sessionToken === expectedToken;
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(comments).where(eq(comments.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
