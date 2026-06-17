import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "articles");

export interface ArticleMetadata {
  title: string;
  slug: string;
  author: string;
  date: string;
  status: "draft" | "published";
  description: string;
  tags: string[];
}

interface ArticleFrontmatter {
  title: string;
  author: string;
  date: string;
  status: "draft" | "published";
  description: string;
  tags: string[];
}

export function getArticleBySlug(
  slug: string
): { metadata: ArticleMetadata; content: string } | null {
  try {
    const articleDir = path.join(ARTICLES_DIR, slug);
    if (!fs.existsSync(articleDir)) return null;

    const mdxPath = path.join(articleDir, "content.mdx");
    if (!fs.existsSync(mdxPath)) return null;

    const fileContent = fs.readFileSync(mdxPath, "utf-8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as ArticleFrontmatter;

    return {
      metadata: {
        title: frontmatter.title,
        slug,
        author: frontmatter.author,
        date: frontmatter.date,
        status: frontmatter.status,
        description: frontmatter.description,
        tags: frontmatter.tags ?? [],
      },
      content,
    };
  } catch (error) {
    console.error(`Error reading article for slug ${slug}:`, error);
    return null;
  }
}

export function getAllArticleSlugs(): string[] {
  try {
    if (!fs.existsSync(ARTICLES_DIR)) return [];
    return fs.readdirSync(ARTICLES_DIR).filter((file) => {
      const fullPath = path.join(ARTICLES_DIR, file);
      if (!fs.statSync(fullPath).isDirectory()) return false;
      // Only include folders that contain a content.mdx
      return fs.existsSync(path.join(fullPath, "content.mdx"));
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
    const article = getArticleBySlug(slug);
    if (article && article.metadata.status === "published") {
      articles.push(article.metadata);
    }
  }

  return articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
