import Link from "next/link";
import { getPublishedArticles } from "@/lib/mdx";
import { getPublishedJournals } from "@/lib/journals";
import { Footer } from "@/components/Footer";

export default function SitemapPage() {
  const articles = getPublishedArticles();
  const journals = getPublishedJournals();

  return (
    <div className="page-container">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>
      <main className="latex-article">
        <h1
          className="article-page-title"
          style={{ textAlign: "center", marginBottom: "var(--space-md)" }}
        >
          SITEMAP
        </h1>
        <p
          className="article-page-date"
          style={{
            textAlign: "center",
            fontStyle: "italic",
            marginBottom: "var(--space-xl)",
          }}
        >
          Index of all pages on masbill.xyz
        </p>

        <section aria-label="Sitemap Sections">
          <h2 className="section-title">Main Pages</h2>
          <ul className="latex-list">
            <li className="article-list-item">
              <Link href="/" className="article-title-link">
                Homepage
              </Link>
              <div className="article-meta">
                The home page containing author profile, recent articles,
                journals, and projects.
              </div>
            </li>
          </ul>

          <h2 className="section-title">Articles</h2>
          <ul
            className="latex-list"
            style={{ listStyle: "none", paddingLeft: 0 }}
          >
            {articles.map((article) => (
              <li key={article.slug} className="article-list-item">
                <Link
                  href={`/articles/${article.slug}`}
                  className="article-title-link"
                >
                  {article.title}
                </Link>
                <div className="article-meta">
                  <span>By {article.author || "Billal Fauzan"}</span> •{" "}
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="section-title">Journals</h2>
          <ul
            className="latex-list"
            style={{ listStyle: "none", paddingLeft: 0 }}
          >
            {journals.map((journal) => (
              <li key={journal.slug} className="article-list-item">
                <Link
                  href={`/journals/${journal.slug}`}
                  className="article-title-link"
                >
                  {journal.title}
                </Link>
                <div className="article-meta">
                  <span>By {journal.author}</span> •{" "}
                  <time dateTime={journal.published_at}>
                    {new Date(journal.published_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
