import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const expectedToken = crypto
      .createHash("sha256")
      .update(adminPassword)
      .digest("hex");

    const authenticated = sessionToken === expectedToken;

    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
