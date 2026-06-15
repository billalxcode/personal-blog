import fs from "fs";
import path from "path";
import { ArticleMetadata } from "./latex-parser/types";

const ARTICLES_DIR = path.join(process.cwd(), "articles");

export function getArticleMetadata(slug: string): ArticleMetadata | null {
  try {
    const metaPath = path.join(ARTICLES_DIR, slug, "metadata.json");
    if (!fs.existsSync(metaPath)) return null;
    const content = fs.readFileSync(metaPath, "utf-8");
    return JSON.parse(content) as ArticleMetadata;
  } catch (error) {
    console.error(`Error reading metadata for slug ${slug}:`, error);
    return null;
  }
}

export function getArticleSource(
  slug: string,
  entrypoint: string
): string | null {
  try {
    const sourcePath = path.join(ARTICLES_DIR, slug, entrypoint);
    if (!fs.existsSync(sourcePath)) return null;
    return fs.readFileSync(sourcePath, "utf-8");
  } catch (error) {
    console.error(`Error reading source for slug ${slug}:`, error);
    return null;
  }
}

export function getAllArticleSlugs(): string[] {
  try {
    if (!fs.existsSync(ARTICLES_DIR)) return [];
    return fs.readdirSync(ARTICLES_DIR).filter((file) => {
      const fullPath = path.join(ARTICLES_DIR, file);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }
}

export function getPublishedArticles(): ArticleMetadata[] {
  const slugs = getAllArticleSlugs();
  const articles: ArticleMetadata[] = [];

  for (const slug of slugs) {
    const meta = getArticleMetadata(slug);
    if (meta && meta.status === "published") {
      articles.push(meta);
    }
  }

  return articles.sort((a, b) => {
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });
}
