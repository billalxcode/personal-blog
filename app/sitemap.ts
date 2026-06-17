import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedArticles } from "@/lib/mdx";
import { getPublishedJournals } from "@/lib/journals";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const journals = getPublishedJournals();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const journalEntries: MetadataRoute.Sitemap = journals.map((journal) => ({
    url: `${siteConfig.url}/journals/${journal.slug}`,
    lastModified: new Date(journal.updated_at),
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
    ...journalEntries,
  ];
}
