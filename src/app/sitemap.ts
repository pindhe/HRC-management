import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hagereadingclub.org",
      lastModified: new Date("2026-08-26"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://hagereadingclub.org/home",
      lastModified: new Date("2026-08-26"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
