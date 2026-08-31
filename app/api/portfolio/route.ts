import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}
