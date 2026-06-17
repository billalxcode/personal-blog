import Link from "next/link";
import type { JournalMetadata } from "@/lib/latex-parser/types";

interface JournalListProps {
  journals: JournalMetadata[];
}

export function JournalList({ journals }: JournalListProps) {
  if (journals.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#666" }}>
        No journals published yet.
      </p>
    );
  }

  return (
    <ul className="article-list" role="list">
      {journals.map((journal) => (
        <li key={journal.slug} className="article-list-item">
          <Link
            href={`/journals/${journal.slug}`}
            className="article-title-link"
          >
            {journal.title}
          </Link>
          <div className="article-meta">
            <span>{journal.author}</span>
            {" · "}
            <time dateTime={journal.published_at}>
              {new Date(journal.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
