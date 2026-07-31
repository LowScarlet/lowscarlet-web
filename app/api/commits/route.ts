/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

// Cache route response for 10 minutes (600 seconds) to prevent GitHub API rate limit 403
export const revalidate = 600;

const staticCommits = [
  {
    message: "feat: add dashboard layout",
    date: "2026-04-12T00:00:00Z",
  },
  {
    message: "fix: improve mobile responsiveness",
    date: "2026-04-11T00:00:00Z",
  },
  {
    message: "style: refine UI spacing",
    date: "2026-04-10T00:00:00Z",
  },
  {
    message: "feat: add blog carousel",
    date: "2026-04-09T00:00:00Z",
  },
];

export async function GET() {
  try {
    const token = process.env.GITHUB_PAT;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'lowscarlet-web-app',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') || token.startsWith('token ')
        ? token
        : `Bearer ${token}`;
    }

    const res = await fetch(
      'https://api.github.com/repos/LowScarlet/lowscarlet-web/commits?per_page=4',
      {
        headers,
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`GitHub API error (${res.status}): ${errText}. Returning static commits fallback.`);
      return NextResponse.json(staticCommits);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("GitHub API did not return an array. Response body:", data);
      return NextResponse.json(staticCommits);
    }

    const mapped = data.map((item: any) => ({
      message: item.commit?.message || "Commit",
      date: item.commit?.author?.date || new Date().toISOString(),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Commits fetch error, returning static fallback:", error);
    return NextResponse.json(staticCommits);
  }
}
