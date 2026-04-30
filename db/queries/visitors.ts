import { db } from "@/db";
import { visitors } from "@/db/schema";
import { count } from "drizzle-orm";

export async function addVisitor(data: {
  ip: string;
  country?: string;
  city?: string;
}) {
  const result = await db
    .insert(visitors)
    .values({
      ipAddress: data.ip,
      country: data.country,
      city: data.city,
    })
    .onConflictDoNothing()
    .returning();

  return result.length > 0;
}

export async function getVisitorCount() {
  const result = await db
    .select({ total: count() })
    .from(visitors);

  return result[0].total;
}

export async function getVisitors() {
  return await db.select().from(visitors);
}

export function getIP(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0] ?? "unknown";
}

export async function getLocation(ip: string) {
  const res = await fetch(`https://ipwho.is/${ip}`);
  const data = await res.json();

  return {
    country: data.country,
    city: data.city,
  };
}