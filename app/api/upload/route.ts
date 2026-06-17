import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = crypto.createHash("sha256").update(adminPassword).digest("hex");
  return sessionToken === expectedToken;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'image.png';

    if (!request.body) {
      return NextResponse.json({ message: "No body provided" }, { status: 400 });
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
