import Link from "next/link";
import type { ArticleMetadata } from "@/lib/mdx";

interface ArticleListProps {
  articles: ArticleMetadata[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p
        style={{
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "0.85rem",
          color: "#444",
          padding: "12px 0",
          borderTop: "1px solid #e5e5e5",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        No articles published yet.
      </p>
    );
  }

  return (
    <ul className="article-list" role="list">
      {articles.map((article, idx) => (
        <li key={article.slug} className="article-list-item">
          <div className="article-list__num" aria-hidden="true">
            {String(idx + 1).padStart(2, "0")}
          </div>
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
