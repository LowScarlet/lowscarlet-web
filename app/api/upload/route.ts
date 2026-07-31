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
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    const errMsg = (error as Error).message || "";
    
    if (errMsg.includes("private store") || errMsg.includes("private access")) {
      return NextResponse.json({ 
        message: "Vercel Blob Store Anda dikonfigurasi sebagai 'Private'. Harap ubah Access Level menjadi 'Public' di Vercel Dashboard (Storage > Blob > Settings) agar gambar project dapat diakses oleh pengunjung portfolio Anda." 
      }, { status: 400 });
    }

    return NextResponse.json({ message: errMsg }, { status: 500 });
  }
}
