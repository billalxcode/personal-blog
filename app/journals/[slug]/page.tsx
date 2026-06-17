import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getJournalMetadata,
  getJournalSource,
  getAllJournalSlugs,
} from "@/lib/journals";
import { JournalRenderer } from "@/components/JournalRenderer";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllJournalSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = getJournalMetadata(slug);
  if (!metadata) return { title: "Not Found" };

  const journalUrl = `${siteConfig.url}/journals/${slug}`;
  const journalDescription = `${metadata.title} — a research journal by ${metadata.author}`;

  return {
    title: metadata.title,
    description: journalDescription,
    authors: [{ name: metadata.author }],
    openGraph: {
      type: "article",
      title: metadata.title,
      description: journalDescription,
      url: journalUrl,
      siteName: siteConfig.title,
      publishedTime: metadata.published_at,
      modifiedTime: metadata.updated_at,
      authors: [metadata.author],
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: journalDescription,
    },
    alternates: {
      canonical: journalUrl,
    },
  };
}

export default async function JournalPage({ params }: PageProps) {
  const { slug } = await params;
  const metadata = getJournalMetadata(slug);

  if (!metadata || metadata.status !== "published") {
    notFound();
  }

  const source = getJournalSource(slug, metadata.entrypoint);
  if (!source) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: metadata.title,
    author: {
      "@type": "Person",
      name: metadata.author,
    },
    datePublished: metadata.published_at,
    dateModified: metadata.updated_at,
    url: `${siteConfig.url}/journals/${slug}`,
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/journals/${slug}`,
    },
  };

  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </nav>
      <article>
        <header className="article-header">
          <h1 className="article-page-title">{metadata.title}</h1>
          <p className="article-page-author">{metadata.author}</p>
          <time
            className="article-page-date"
            dateTime={metadata.published_at}
          >
            {new Date(metadata.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>
        <JournalRenderer source={source} slug={slug} />
      </article>
      <Footer />
    </div>
  );
}
