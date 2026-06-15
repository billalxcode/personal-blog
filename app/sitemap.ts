import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articleEntries,
  ];
}
