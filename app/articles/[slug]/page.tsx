import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getArticleMetadata,
  getArticleSource,
  getAllArticleSlugs,
} from "@/lib/articles";
import { ArticleRenderer } from "@/components/ArticleRenderer";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = getArticleMetadata(slug);
  if (!metadata) return { title: "Not Found" };
  return {
    title: metadata.title,
    description: `${metadata.title} by ${metadata.author}`,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const metadata = getArticleMetadata(slug);

  if (!metadata || metadata.status !== "published") {
    notFound();
  }

  const source = getArticleSource(slug, metadata.entrypoint);
  if (!source) {
    notFound();
  }

  return (
    <div className="page-container">
      <Link href="/" className="back-link">
        ← Back to articles
      </Link>
      <header className="article-header">
        <h1 className="article-page-title">{metadata.title}</h1>
        <p className="article-page-author">{metadata.author}</p>
        <p className="article-page-date">
          {new Date(metadata.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>
      <ArticleRenderer source={source} slug={slug} />
      <Footer />
    </div>
  );
}
