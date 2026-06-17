import { NextResponse } from "next/server";
import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await db
    .select()
    .from(config)
    .where(eq(config.id, id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json(
      { message: "Config not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result[0]);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const expectedToken = crypto
      .createHash("sha256")
      .update(adminPassword)
      .digest("hex");

    if (sessionToken !== expectedToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { value } = await req.json();

    const updated = await db
      .update(config)
      .set({ value })
      .where(eq(config.id, id))
      .returning();

    console.log(`[Database Update] Config: ${id} =`, updated[0]?.value);

    return NextResponse.json({ success: true, id, value });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}