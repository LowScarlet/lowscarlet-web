import { NextResponse } from "next/server";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await req.json();

    const updated = await db
      .update(experiences)
      .set({
        company: data.company,
        location: data.location,
        role: data.role,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: Boolean(data.isCurrent),
        highlights: data.highlights,
        images: data.images || [],
        displayOrder: Number(data.displayOrder || 0),
      })
      .where(eq(experiences.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await db.delete(experiences).where(eq(experiences.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete experience" }, { status: 500 });
  }
}
