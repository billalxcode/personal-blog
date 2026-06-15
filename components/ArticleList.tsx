import Link from "next/link";
import type { ArticleMetadata } from "@/lib/latex-parser/types";

interface ArticleListProps {
  articles: ArticleMetadata[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#666" }}>
        No articles published yet.
      </p>
    );
  }

  return (
    <ul className="article-list">
      {articles.map((article) => (
        <li key={article.slug} className="article-list-item">
          <Link href={`/articles/${article.slug}`} className="article-title-link">
            {article.title}
          </Link>
          <div className="article-meta">
            {article.author} ·{" "}
            {new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
