import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { getIP } from "@/db/queries/visitors";
import { desc } from "drizzle-orm";
import { censorIp } from "@/libs/ipUtils";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt));

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
    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || null;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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
