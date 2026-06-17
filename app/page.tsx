import { AuthorProfile } from "@/components/AuthorProfile";
import { ArticleList } from "@/components/ArticleList";
import { JournalList } from "@/components/JournalList";
import { Footer } from "@/components/Footer";
import { getPublishedArticles } from "@/lib/mdx";
import { getPublishedJournals } from "@/lib/journals";
import { ProjectList } from "@/components/ProjectList";

export default function Home() {
  const articles = getPublishedArticles();
  const journals = getPublishedJournals();

  return (
    <div className="page-container">
      <AuthorProfile />
      <main>
        <section aria-label="Blog Articles">
          <h2 className="section-title">Articles</h2>
          <ArticleList articles={articles} />
        </section>
        <section aria-label="Research Journals">
          <h2 className="section-title">Journals</h2>
          <JournalList journals={journals} />
        </section>
        <ProjectList />
      </main>
      <Footer />
    </div>
  );
}
