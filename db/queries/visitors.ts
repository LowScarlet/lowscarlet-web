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

export async function getVisitorStatsByCountry() {
  const allVisitors = await db.select().from(visitors);
  const total = allVisitors.length;

  const countryCounts: Record<string, { count: number; lastVisited: Date | null; cities: Set<string> }> = {};
  const cityCounts: Record<string, { city: string; country: string; count: number; lastVisited: Date | null }> = {};

  for (const v of allVisitors) {
    const c = v.country && v.country.trim() !== "" ? v.country.trim() : "Unknown";
    const city = v.city && v.city.trim() !== "" ? v.city.trim() : null;

    if (!countryCounts[c]) {
      countryCounts[c] = { count: 0, lastVisited: null, cities: new Set() };
    }
    countryCounts[c].count += 1;
    if (city) countryCounts[c].cities.add(city);

    if (v.createdAt) {
      const vDate = new Date(v.createdAt);
      if (!countryCounts[c].lastVisited || vDate > countryCounts[c].lastVisited) {
        countryCounts[c].lastVisited = vDate;
      }
    }

    if (city) {
      const cityKey = `${city.toLowerCase()}__${c.toLowerCase()}`;
      if (!cityCounts[cityKey]) {
        cityCounts[cityKey] = { city, country: c, count: 0, lastVisited: null };
      }
      cityCounts[cityKey].count += 1;
      if (v.createdAt) {
        const vDate = new Date(v.createdAt);
        if (!cityCounts[cityKey].lastVisited || vDate > cityCounts[cityKey].lastVisited) {
          cityCounts[cityKey].lastVisited = vDate;
        }
      }
    }
  }

  const countryStats = Object.entries(countryCounts)
    .map(([country, info]) => ({
      country,
      count: info.count,
      percentage: total > 0 ? parseFloat(((info.count / total) * 100).toFixed(1)) : 0,
      citiesCount: info.cities.size,
      lastVisited: info.lastVisited,
    }))
    .sort((a, b) => b.count - a.count);

  const cityStats = Object.values(cityCounts)
    .map((info) => ({
      city: info.city,
      country: info.country,
      count: info.count,
      percentage: total > 0 ? parseFloat(((info.count / total) * 100).toFixed(1)) : 0,
      lastVisited: info.lastVisited,
    }))
    .sort((a, b) => b.count - a.count);

  const knownCountriesCount = countryStats.filter((c) => c.country !== "Unknown").length;
  const topCountry = countryStats.find((c) => c.country !== "Unknown")?.country || null;

  return {
    totalVisitors: total,
    totalCountries: knownCountriesCount,
    topCountry,
    countryStats,
    cityStats,
  };
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