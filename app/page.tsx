import { AuthorProfile } from "@/components/AuthorProfile";
import { ArticleList } from "@/components/ArticleList";
import { Footer } from "@/components/Footer";
import { getPublishedArticles } from "@/lib/articles";

export default function Home() {
  const articles = getPublishedArticles();

  return (
    <div className="page-container">
      <AuthorProfile />
      <main>
        <ArticleList articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
