import type { MetadataRoute } from "next";

const BASE = "https://zenaxis.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/cotacao`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
