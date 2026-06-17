import Link from "next/link";
import type { ArticleMetadata } from "@/lib/mdx";

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
    <ul className="article-list" role="list">
      {articles.map((article) => (
        <li key={article.slug} className="article-list-item">
          <Link
            href={`/articles/${article.slug}`}
            className="article-title-link"
          >
            {article.title}
          </Link>
          <div className="article-meta">
            <span>{article.author}</span>
            {" · "}
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
