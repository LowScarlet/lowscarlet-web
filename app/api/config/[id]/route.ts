import { NextResponse } from "next/server";
import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";

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