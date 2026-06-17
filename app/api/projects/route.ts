/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = crypto.createHash("sha256").update(adminPassword).digest("hex");
  return sessionToken === expectedToken;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = db.select().from(projects);

    if (category) {
      query = query.where(eq(projects.category, category)) as any;
    }

    query = query.orderBy(desc(projects.startDate)) as any;

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const newProject = await db.insert(projects).values({
      title: data.title,
      category: data.category || "webs",
      description: data.description,
      images: data.images || [],
      tags: data.tags || [],
      techs: data.techs || [],
      links: data.links || [],
      contributors: data.contributors || [],
      startDate: data.startDate ? new Date(data.startDate) : null,
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
    }).returning();

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
