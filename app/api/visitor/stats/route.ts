import { NextResponse } from "next/server";
import { getVisitorStatsByCountry } from "@/db/queries/visitors";
import { getCountryCode, getCountryFlag } from "@/libs/countryMapping";

export async function GET() {
  try {
    const stats = await getVisitorStatsByCountry();

    const enrichedCountryStats = stats.countryStats.map((item) => {
      const meta = getCountryCode(item.country);
      const flag = getCountryFlag(meta.code);

      return {
        ...item,
        code: meta.code,
        iso3: meta.iso3,
        flag,
      };
    });

    const enrichedCityStats = stats.cityStats.map((item) => {
      const meta = getCountryCode(item.country);
      const flag = getCountryFlag(meta.code);

      return {
        ...item,
        code: meta.code,
        flag,
      };
    });

    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      totalCountries: stats.totalCountries,
      topCountry: stats.topCountry,
      countryStats: enrichedCountryStats,
      cityStats: enrichedCityStats,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor stats" },
      { status: 500 }
    );
  }
}
