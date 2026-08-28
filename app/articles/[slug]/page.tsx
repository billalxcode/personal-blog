import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

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
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  const { metadata } = article;
  const articleUrl = `${siteConfig.url}/articles/${slug}`;

  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: metadata.author }],
    keywords: metadata.tags,
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      url: articleUrl,
      siteName: siteConfig.title,
      publishedTime: metadata.date,
      authors: [metadata.author],
      locale: siteConfig.locale,
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.metadata.status !== "published") {
    notFound();
  }

  const { metadata, content } = article;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: metadata.title,
    description: metadata.description,
    author: {
      "@type": "Person",
      name: metadata.author,
    },
    datePublished: metadata.date,
    url: `${siteConfig.url}/articles/${slug}`,
    keywords: metadata.tags.join(", "),
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${slug}`,
    },
  };

  const formattedDate = new Date(metadata.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <Link href="/" className="back-link">
          ← Back to contents
        </Link>
      </nav>
      <div className="paper-folio" aria-hidden="true">
        <span className="paper-folio__left">Article - Preprint</span>
        <span className="paper-folio__right">
          masbill.xyz · {formattedDate}
        </span>
      </div>
      <article>
        <header className="article-header">
          <h1 className="article-page-title">{metadata.title}</h1>
          <p className="article-page-author">{metadata.author}</p>
          <time className="article-page-date" dateTime={metadata.date}>
            {formattedDate}
          </time>
          <div className="paper-history">
            Manuscript received {formattedDate} · Published {formattedDate} ·
            Correspondence: {siteConfig.author.email}
          </div>
          {metadata.description && (
            <div className="paper-lead">
              <strong>Abstract:</strong> {metadata.description}
            </div>
          )}
          {metadata.tags.length > 0 && (
            <div className="article-page-tags">
              {metadata.tags.map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <MDXContent source={content} />
      </article>
      <Footer />
    </div>
  );
}
