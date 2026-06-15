import { AuthorProfile } from "@/components/AuthorProfile";
import { ArticleList } from "@/components/ArticleList";
import { Footer } from "@/components/Footer";
import { getPublishedArticles } from "@/lib/articles";
import { ProjectList } from "@/components/ProjectList";

export default function Home() {
  const articles = getPublishedArticles();

  return (
    <div className="page-container">
      <AuthorProfile />
      <main>
        <section aria-label="Published Articles">
          <ArticleList articles={articles} />
        </section>
        <ProjectList />
      </main>
      <Footer />
    </div>
  );
}
