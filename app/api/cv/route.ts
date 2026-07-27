import { getFullCvData } from "@/db/queries/cv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cvData = await getFullCvData();
    return NextResponse.json({
      success: true,
      data: cvData,
    });
  } catch (error: any) {
    console.error("[API GET /api/cv] Error fetching CV data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch CV data",
      },
      { status: 500 }
    );
  }
}
