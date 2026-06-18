import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Security check: Only allow proxying local paths or Vercel Blob URLs
    const isLocal = url.startsWith('/');
    const isVercelBlob = url.startsWith('https://') && url.includes('.blob.vercel-storage.com');

    if (!isLocal && !isVercelBlob) {
      return new NextResponse('Forbidden: Only local or Vercel Blob URLs are allowed', { status: 403 });
    }

    let fileResponse;
    if (isLocal) {
      const origin = new URL(request.url).origin;
      fileResponse = await fetch(new URL(url, origin).toString());
    } else {
      fileResponse = await fetch(url);
    }

    if (!fileResponse.ok) {
      return new NextResponse('Failed to fetch file', { status: fileResponse.status });
    }

    const contentType = fileResponse.headers.get('Content-Type') || 'application/pdf';
    const blobBuffer = await fileResponse.arrayBuffer();

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    responseHeaders.set('Content-Disposition', 'inline');

    return new NextResponse(blobBuffer, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error in proxy-pdf route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
