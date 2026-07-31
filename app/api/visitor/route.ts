import { NextResponse } from "next/server";
import { addVisitor, getIP, getLocation } from "@/db/queries/visitors";
import { incrementVisitorsCount } from "@/db/queries/config";
import { rateLimit } from "@/libs/rateLimit";

export async function GET(req: Request) {
  const ip = getIP(req);

  // Rate limit: max 10 visitor pings per IP per 60 seconds
  const rl = rateLimit(`visitor:${ip}`, { limit: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json({ ok: true }); // silently ignore, don't expose limit
  }

  let country: string | undefined;
  let city: string | undefined;

  try {
    const location = await getLocation(ip);
    country = location.country;
    city = location.city;
  } catch {
    // hidup memang tidak selalu akurat
  }

  const isNewVisitor = await addVisitor({
    ip,
    country,
    city,
  });

  if (isNewVisitor) {
    await incrementVisitorsCount();
  }

  return NextResponse.json({ ok: true });
}