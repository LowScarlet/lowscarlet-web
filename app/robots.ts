import { MetadataRoute } from "next";

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/social/"],
    },
    sitemap: "https://lowscarlet.my.id/sitemap.xml",
  };
}
