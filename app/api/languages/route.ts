import { NextResponse } from "next/server";
import { db } from "@/db";
import { languages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = crypto.createHash("sha256").update(adminPassword).digest("hex");
  return sessionToken === expectedToken;
}

export async function GET() {
  try {
    const result = await db
      .select()
      .from(languages)
      .orderBy(asc(languages.displayOrder), asc(languages.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch languages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const created = await db.insert(languages).values({
      name: data.name,
      proficiency: data.proficiency,
      displayOrder: Number(data.displayOrder || 0),
    }).returning();

    return NextResponse.json(created[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create language entry" }, { status: 500 });
  }
}
