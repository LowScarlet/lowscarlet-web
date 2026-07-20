import { MetadataRoute } from "next";

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lowscarlet.my.id";

  const routes = [
    "",
    "/dashboard",
    "/social",
    "/projects/webs",
    "/projects/games",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
