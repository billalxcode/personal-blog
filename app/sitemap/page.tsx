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
        ← Back to contents
      </Link>
      <div className="paper-folio" aria-hidden="true">
        <span className="paper-folio__left">Index — Sitemap</span>
        <span className="paper-folio__right">masbill.xyz</span>
      </div>
      <main className="latex-article">
        <header className="article-header">
          <h1 className="article-page-title">Sitemap</h1>
          <p className="article-page-date">Index of all pages on masbill.xyz</p>
        </header>

        <section aria-label="Sitemap Sections">
          <h2 className="section-title">
            <span className="section-title__num">—</span> Main Pages
          </h2>
          <ul className="article-list">
            <li className="article-list-item">
              <div className="article-list__num" aria-hidden="true">
                01
              </div>
              <Link href="/" className="article-title-link">
                Homepage
              </Link>
              <div className="article-meta">
                The home page containing author profile, recent articles,
                journals, and projects.
              </div>
            </li>
          </ul>

          <h2 className="section-title">
            <span className="section-title__num">I.</span> Articles{" "}
            <span className="section-title__count">— {articles.length}</span>
          </h2>
          <ul className="article-list">
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
                  <span>{article.author || "Billal Fauzan"}</span> ·{" "}
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

          <h2 className="section-title">
            <span className="section-title__num">II.</span> Journals{" "}
            <span className="section-title__count">— {journals.length}</span>
          </h2>
          <ul className="article-list">
            {journals.map((journal, idx) => (
              <li key={journal.slug} className="article-list-item">
                <div className="article-list__num" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <Link
                  href={`/journals/${journal.slug}`}
                  className="article-title-link"
                >
                  {journal.title}
                </Link>
                <div className="article-meta">
                  <span>{journal.author}</span> ·{" "}
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
