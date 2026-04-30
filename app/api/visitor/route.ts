import { NextResponse } from "next/server";
import { addVisitor, getIP, getLocation } from "@/db/queries/visitors";
import { incrementVisitorsCount } from "@/db/queries/config";

export async function GET(req: Request) {
  const ip = getIP(req);

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

  // ⬇️ INI BAGIAN YANG KAMU MAU
  if (isNewVisitor) {
    await incrementVisitorsCount();
  }

  return NextResponse.json({ ok: true });
}