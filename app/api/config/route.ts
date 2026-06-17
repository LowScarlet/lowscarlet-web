import { NextResponse } from "next/server";
import { db } from "@/db";
import { config } from "@/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await db
    .select({
      id: config.id,
      value: config.value,
    })
    .from(config);

  const mapped = Object.fromEntries(
    data.map(item => [item.id, item.value])
  );

  return NextResponse.json(mapped);
}