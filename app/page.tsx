import { AuthorProfile } from "@/components/AuthorProfile";
import { ArticleList } from "@/components/ArticleList";
import { JournalList } from "@/components/JournalList";
import { Footer } from "@/components/Footer";
import { getPublishedArticles } from "@/lib/mdx";
import { getPublishedJournals } from "@/lib/journals";
import { ProjectList } from "@/components/ProjectList";
import { siteConfig } from "@/config/site";

export default function Home() {
  const articles = getPublishedArticles();
  const journals = getPublishedJournals();

  return (
    <div className="page-container">
      <AuthorProfile />
      <div className="editorial-intro" role="note" aria-label="Editorial">
        <p>
          A single-column preprint for notes, tutorials, and formal studies in{" "}
          <em>Machine Learning</em>, <em>Agentic AI</em>, and{" "}
          <em>Computer Vision</em>. Articles are written in MDX for close
          reading; Journals are typeset from LaTeX with KaTeX, theorems, and
          numbered references - designed for print, read on screen.
        </p>
      </div>
      <nav className="toc-nav" aria-label="Contents">
        <div className="toc-nav__label">Contents</div>
        <ol className="toc-nav__list">
          <li>
            <a href="#articles">I. Articles</a> <span>- {articles.length}</span>
          </li>
          <li>
            <a href="#journals">II. Journals</a> <span>- {journals.length}</span>
          </li>
          <li>
            <a href="#systems">III. Systems</a>{" "}
            <span>- {siteConfig.projects.length}</span>
          </li>
        </ol>
      </nav>
      <main>
        <section id="articles" aria-label="Blog Articles">
          <h2 className="section-title">
            <span className="section-title__num">I.</span> Articles{" "}
            <span className="section-title__count">- {articles.length}</span>
          </h2>
          <ArticleList articles={articles} />
        </section>
        <section id="journals" aria-label="Research Journals">
          <h2 className="section-title">
            <span className="section-title__num">II.</span> Journals{" "}
            <span className="section-title__count">- {journals.length}</span>
          </h2>
          <JournalList journals={journals} />
        </section>
        <div id="systems">
          <ProjectList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
