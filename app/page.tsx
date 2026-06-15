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
        <ArticleList articles={articles} />
        <ProjectList />
      </main>
      <Footer />
    </div>
  );
}
