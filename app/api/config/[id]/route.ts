import { NextResponse } from "next/server";
import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await db
    .select()
    .from(config)
    .where(eq(config.id, params.id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json(
      { message: "Config not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result[0]);
}