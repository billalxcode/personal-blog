# Science Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static personal science blog that renders pure LaTeX (.tex) files into IEEE-style academic paper pages using a custom parser + KaTeX.

**Architecture:** Next.js 16 App Router with static generation. Articles stored as `.tex` files in `articles/[slug]/` folders with `metadata.json`. A custom LaTeX tokenizer/parser converts `.tex` → AST → React components, delegating math to KaTeX server-side rendering. IEEE-style B&W styling with serif fonts.

**Tech Stack:** Next.js 16, React 19, TypeScript, KaTeX, Tailwind CSS (minimal — mostly custom CSS)

**Spec:** `docs/superpowers/specs/2025-06-15-science-blog-design.md`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `config/site.ts` | Site configuration (author name, bio, links) |
| `lib/latex-parser/types.ts` | Token and AST node type definitions |
| `lib/latex-parser/tokenizer.ts` | LaTeX source → token stream |
| `lib/latex-parser/parser.ts` | Token stream → AST |
| `lib/latex-parser/renderer.tsx` | AST → React components |
| `lib/latex-parser/katex-bridge.ts` | Math expression → KaTeX HTML string |
| `lib/articles.ts` | Read metadata.json, list/filter articles |
| `components/AuthorProfile.tsx` | Author profile section for homepage |
| `components/ArticleList.tsx` | Article list section for homepage |
| `components/Footer.tsx` | Footer component |
| `components/ArticleRenderer.tsx` | Full article rendering component |
| `app/articles/[slug]/page.tsx` | Article detail page route |
| `articles/quantum-entanglement/metadata.json` | Sample article metadata |
| `articles/quantum-entanglement/main.tex` | Sample article LaTeX content |

### Modified Files
| File | Change |
|------|--------|
| `app/layout.tsx` | Swap to serif font, B&W theme, add KaTeX CSS |
| `app/page.tsx` | Replace default content with homepage |
| `app/globals.css` | IEEE-style typography and layout CSS |
| `next.config.ts` | Add image patterns for article images |
| `package.json` | Add `katex` dependency |

---

## Task 1: Install KaTeX and Configure Project

**Files:**
- Modify: `package.json` (add katex)
- Modify: `next.config.ts` (image config)

- [ ] **Step 1: Install KaTeX**

```bash
npm install katex
```

- [ ] **Step 2: Update next.config.ts**

Write to `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/articles/*/images/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock next.config.ts
git commit -m "chore: install katex, configure image patterns"
```

---

## Task 2: Site Configuration and Types

**Files:**
- Create: `config/site.ts`
- Create: `lib/latex-parser/types.ts`

- [ ] **Step 1: Create site config**

Write to `config/site.ts`:

```typescript
export const siteConfig = {
  title: "Journal",
  author: {
    name: "John Doe",
    affiliation: "Department of Computer Science, University",
    bio: "Researcher in quantum computing, machine learning, and mathematical optimization.",
    email: "john@example.com",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} John Doe. All rights reserved.`,
  },
} as const;
```

- [ ] **Step 2: Create LaTeX parser type definitions**

Write to `lib/latex-parser/types.ts` — contains all Token types, AST node interfaces (DocumentNode, SectionNode, MathInlineNode, TheoremNode, BibliographyNode, etc.), and ArticleMetadata interface. Full contents in the spec section 4.

Key types:
- `TokenType`: COMMAND, BRACE_OPEN/CLOSE, BRACKET_OPEN/CLOSE, MATH_INLINE, MATH_DISPLAY, ENVIRONMENT_BEGIN/END, TEXT, NEWLINE, AMPERSAND, LINEBREAK
- `Token`: { type, value, line, col }
- `ASTNode`: Discriminated union of ~35 node types
- `ArticleMetadata`: { title, slug, author, created_at, updated_at, status, published_at, entrypoint }

- [ ] **Step 3: Commit**

```bash
git add config/site.ts lib/latex-parser/types.ts
git commit -m "feat: add site config and LaTeX parser types"
```

---

## Task 3: KaTeX Bridge

**Files:**
- Create: `lib/latex-parser/katex-bridge.ts`

- [ ] **Step 1: Create KaTeX bridge module**

Write to `lib/latex-parser/katex-bridge.ts`:

```typescript
import katex from "katex";

export function renderMath(latex: string, options: { displayMode?: boolean; throwOnError?: boolean } = {}): string {
  const { displayMode = false, throwOnError = false } = options;
  try {
    return katex.renderToString(latex, { displayMode, throwOnError, trust: true, strict: false });
  } catch (error) {
    if (throwOnError) throw error;
    const escaped = latex.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
    return `<span class="katex-error" title="KaTeX parse error">${escaped}</span>`;
  }
}

export function renderInlineMath(latex: string): string {
  return renderMath(latex, { displayMode: false });
}

export function renderDisplayMath(latex: string): string {
  return renderMath(latex, { displayMode: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/latex-parser/katex-bridge.ts
git commit -m "feat: add KaTeX bridge for math rendering"
```

---

## Task 4: LaTeX Tokenizer

**Files:**
- Create: `lib/latex-parser/tokenizer.ts`

- [ ] **Step 1: Create the tokenizer**

Write to `lib/latex-parser/tokenizer.ts` — a `tokenize(source: string): Token[]` function that processes LaTeX source character-by-character and emits tokens. Handles:
- `%` comments (skip to EOL)
- Double newlines → NEWLINE tokens (paragraph breaks)
- Single newlines → ignored (whitespace)
- `$$...$$` → MATH_DISPLAY
- `$...$` → MATH_INLINE
- `\[...\]` → MATH_DISPLAY
- `\\` → LINEBREAK
- `\begin{env}` → ENVIRONMENT_BEGIN
- `\end{env}` → ENVIRONMENT_END
- `\command` → COMMAND
- `{` `}` `[` `]` `&` → respective tokens
- `~` → non-breaking space (TEXT)
- Whitespace collapse → single space TEXT
- Regular text runs → TEXT

- [ ] **Step 2: Commit**

```bash
git add lib/latex-parser/tokenizer.ts
git commit -m "feat: add LaTeX tokenizer"
```

---

## Task 5: LaTeX Parser (Tokens → AST)

**Files:**
- Create: `lib/latex-parser/parser.ts`

- [ ] **Step 1: Create the parser**

Write to `lib/latex-parser/parser.ts` — a `parse(tokens: Token[]): DocumentNode` function with a recursive descent parser. Key internals:
- `readBraceGroupRaw()`: read `{...}` as raw string
- `readBraceGroupParsed()`: read `{...}` as parsed AST nodes
- `readBracketGroupRaw()`: read optional `[...]`
- `readEnvironmentBodyRaw()`: read env body as raw string (for math)
- `parseUntil(stopCondition)`: parse nodes with paragraph grouping

Handles: documentclass/usepackage (skip), title/author/date (preamble), maketitle, section/subsection/subsubsection, textbf/textit/emph/underline/texttt, label/ref/cite, footnote, href/url, includegraphics, caption, input, newcommand, item, environments (document, abstract, equation/align/gather, itemize/enumerate, theorem/lemma/proof/definition/corollary/remark, figure/table/tabular, thebibliography).

- [ ] **Step 2: Commit**

```bash
git add lib/latex-parser/parser.ts
git commit -m "feat: add LaTeX parser (tokens to AST)"
```

---

## Task 6: LaTeX Renderer (AST → React)

**Files:**
- Create: `lib/latex-parser/renderer.tsx`

- [ ] **Step 1: Create the renderer**

Write to `lib/latex-parser/renderer.tsx` — exports `renderDocument(doc: DocumentNode, slug: string): React.ReactNode`. Uses a `RenderState` for IEEE numbering:
- Sections: Roman numerals (I., II.)
- Subsections: Capital letters (A., B.)
- Subsubsections: Arabic + paren (1), 2))
- Equations: sequential (1), (2)
- Theorems/lemmas/etc: sequential per type

Math nodes rendered via `renderInlineMath`/`renderDisplayMath` from katex-bridge using `dangerouslySetInnerHTML`.

Also handles: bibliography with `[1]` numbering, footnotes collected and rendered at bottom, cite cross-references, figure/table/tabular rendering, and images via `/articles/{slug}/images/{src}`.

- [ ] **Step 2: Commit**

```bash
git add lib/latex-parser/renderer.tsx
git commit -m "feat: add LaTeX AST to React renderer"
```

---

## Task 7: Articles Utility

**Files:**
- Create: `lib/articles.ts`

- [ ] **Step 1: Create articles utility**

Write to `lib/articles.ts` — exports:
- `getArticleMetadata(slug): ArticleMetadata | null` — reads `articles/{slug}/metadata.json`
- `getArticleSource(slug, entrypoint): string | null` — reads `.tex` file
- `getAllArticleSlugs(): string[]` — lists article directories
- `getPublishedArticles(): ArticleMetadata[]` — returns published articles sorted by date desc

All use `fs.readFileSync` (server-side only, called at build time).

- [ ] **Step 2: Commit**

```bash
git add lib/articles.ts
git commit -m "feat: add articles utility for reading metadata and source"
```

---

## Task 8: Global CSS and Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace globals.css with IEEE-style typography**

Write to `app/globals.css`:

```css
@import "katex/dist/katex.min.css";
@import "tailwindcss";

:root {
  --color-text: #000000;
  --color-bg: #ffffff;
  --color-secondary: #333333;
  --max-width: 720px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: "STIX Two Text", Georgia, "Times New Roman", serif;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
}

.page-container { max-width: var(--max-width); margin: 0 auto; padding: 3rem 1.5rem; }

/* Homepage */
.author-profile { text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #000; }
.author-name { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.author-affiliation { font-size: 0.9rem; color: var(--color-secondary); margin-bottom: 0.75rem; }
.author-bio { font-size: 0.95rem; font-style: italic; }

.article-list { list-style: none; }
.article-list-item { padding: 1rem 0; border-bottom: 1px solid #eee; }
.article-list-item a { color: #000; text-decoration: none; }
.article-list-item a:hover { text-decoration: underline; }
.article-title-link { font-size: 1.1rem; font-weight: 600; }
.article-meta { font-size: 0.85rem; color: var(--color-secondary); margin-top: 0.25rem; }

.site-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #000; text-align: center; font-size: 0.8rem; color: var(--color-secondary); }

/* Article page */
.article-header { text-align: center; margin-bottom: 2rem; }
.article-page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.article-page-author { font-size: 1rem; margin-bottom: 0.25rem; }
.article-page-date { font-size: 0.85rem; color: var(--color-secondary); }

.abstract { margin: 1.5rem 2rem; font-size: 0.95rem; text-align: justify; }
.abstract-label { font-weight: 700; font-style: italic; }

.section-title { font-size: 1.15rem; font-weight: 700; text-transform: uppercase; margin: 2rem 0 0.75rem; }
.subsection-title { font-size: 1.05rem; font-weight: 700; font-style: italic; margin: 1.5rem 0 0.5rem; }
.subsubsection-title { font-size: 1rem; font-style: italic; margin: 1rem 0 0.5rem; }

p { text-align: justify; margin-bottom: 0.75rem; }

.equation-wrapper { display: flex; align-items: center; justify-content: center; margin: 1rem 0; position: relative; }
.equation-wrapper .katex-display { flex: 1; text-align: center; }
.equation-number { position: absolute; right: 0; font-size: 0.9rem; }

.katex-display { margin: 1rem 0; text-align: center; overflow-x: auto; }

.latex-list { margin: 0.5rem 0 0.5rem 2rem; }
.latex-list li { margin-bottom: 0.25rem; }

.theorem-env { margin: 1.5rem 0; padding: 0.75rem 0; }
.theorem-head { font-weight: 700; margin-bottom: 0.25rem; }
.theorem-body { font-style: italic; }
.proof-env { margin: 1rem 0; }
.proof-head { margin-bottom: 0.25rem; }
.qed { text-align: right; margin-top: 0.25rem; }
.remark-env { margin: 1rem 0; }

.latex-figure { text-align: center; margin: 1.5rem 0; }
.latex-image { max-width: 100%; height: auto; }
.latex-caption { font-size: 0.9rem; margin-top: 0.5rem; text-align: center; }

.latex-table-wrapper { margin: 1.5rem 0; overflow-x: auto; }
.latex-tabular { border-collapse: collapse; margin: 0 auto; }
.latex-tabular td, .latex-tabular th { padding: 0.35rem 0.75rem; border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: left; }

.latex-bibliography { margin-top: 2rem; }
.bib-list { font-size: 0.9rem; padding-left: 2rem; }
.bib-list li { margin-bottom: 0.5rem; }

.latex-cite { /* inline reference */ }
.latex-ref { color: #000; text-decoration: none; border-bottom: 1px dotted #666; }
.latex-url { font-family: monospace; word-break: break-all; }
.footnote-ref { color: #000; text-decoration: none; }

.latex-footnotes { margin-top: 2rem; font-size: 0.85rem; }
.footnote-separator { border: none; border-top: 1px solid #000; width: 30%; margin: 1rem 0; }
.footnote-list { padding-left: 1.5rem; }

code { font-family: "Courier New", monospace; font-size: 0.9em; background: #f5f5f5; padding: 0.1em 0.3em; }

.katex-error { color: red; font-family: monospace; font-size: 0.85rem; }

.back-link { display: inline-block; margin-bottom: 1.5rem; color: #000; text-decoration: none; font-size: 0.9rem; }
.back-link:hover { text-decoration: underline; }
```

- [ ] **Step 2: Update layout.tsx**

Write to `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: `${siteConfig.author.name} — ${siteConfig.author.bio}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add IEEE-style CSS and update root layout"
```

---

## Task 9: Homepage Components

**Files:**
- Create: `components/AuthorProfile.tsx`
- Create: `components/ArticleList.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create AuthorProfile**

Write to `components/AuthorProfile.tsx`:

```tsx
import { siteConfig } from "@/config/site";

export function AuthorProfile() {
  const { name, affiliation, bio } = siteConfig.author;
  return (
    <header className="author-profile">
      <h1 className="author-name">{name}</h1>
      <p className="author-affiliation">{affiliation}</p>
      <p className="author-bio">{bio}</p>
    </header>
  );
}
```

- [ ] **Step 2: Create ArticleList**

Write to `components/ArticleList.tsx`:

```tsx
import Link from "next/link";
import type { ArticleMetadata } from "@/lib/latex-parser/types";

interface ArticleListProps {
  articles: ArticleMetadata[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p style={{ textAlign: "center", color: "#666" }}>No articles published yet.</p>;
  }

  return (
    <ul className="article-list">
      {articles.map((article) => (
        <li key={article.slug} className="article-list-item">
          <Link href={`/articles/${article.slug}`} className="article-title-link">
            {article.title}
          </Link>
          <div className="article-meta">
            {article.author} · {new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Create Footer**

Write to `components/Footer.tsx`:

```tsx
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>{siteConfig.footer.copyright}</p>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/AuthorProfile.tsx components/ArticleList.tsx components/Footer.tsx
git commit -m "feat: add homepage components (AuthorProfile, ArticleList, Footer)"
```

---

## Task 10: Homepage and Article Page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/articles/[slug]/page.tsx`
- Create: `components/ArticleRenderer.tsx`

- [ ] **Step 1: Create ArticleRenderer component**

Write to `components/ArticleRenderer.tsx`:

```tsx
import { tokenize } from "@/lib/latex-parser/tokenizer";
import { parse } from "@/lib/latex-parser/parser";
import { renderDocument } from "@/lib/latex-parser/renderer";

interface ArticleRendererProps {
  source: string;
  slug: string;
}

export function ArticleRenderer({ source, slug }: ArticleRendererProps) {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  const content = renderDocument(ast, slug);

  return <article className="latex-article">{content}</article>;
}
```

- [ ] **Step 2: Update homepage**

Write to `app/page.tsx`:

```tsx
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
```

- [ ] **Step 3: Create article page**

Write to `app/articles/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleMetadata, getArticleSource, getAllArticleSlugs } from "@/lib/articles";
import { ArticleRenderer } from "@/components/ArticleRenderer";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
```

- [ ] **Step 4: Commit**

```bash
git add components/ArticleRenderer.tsx app/page.tsx app/articles/\[slug\]/page.tsx
git commit -m "feat: add homepage and article detail page"
```

---

## Task 11: Sample Article

**Files:**
- Create: `articles/quantum-entanglement/metadata.json`
- Create: `articles/quantum-entanglement/main.tex`

- [ ] **Step 1: Create sample metadata**

Write to `articles/quantum-entanglement/metadata.json`:

```json
{
  "title": "A Brief Study on Quantum Entanglement",
  "slug": "quantum-entanglement",
  "author": "John Doe",
  "created_at": "2025-06-01",
  "updated_at": "2025-06-15",
  "status": "published",
  "published_at": "2025-06-15",
  "entrypoint": "main.tex"
}
```

- [ ] **Step 2: Create sample LaTeX article**

Write to `articles/quantum-entanglement/main.tex`:

```latex
\documentclass{article}

\title{A Brief Study on Quantum Entanglement}
\author{John Doe}
\date{June 2025}

\begin{document}
\maketitle

\begin{abstract}
This paper explores the fundamental principles of quantum entanglement and its implications for quantum computing. We present a simplified model for understanding Bell states and their applications in quantum information theory.
\end{abstract}

\section{Introduction}
Quantum entanglement is a phenomenon where two particles become correlated in such a way that the quantum state of one particle cannot be described independently of the other \cite{einstein1935}. This property, famously described by Einstein as ``spooky action at a distance,'' has become a cornerstone of modern quantum information science.

\section{Mathematical Framework}
Consider a two-qubit system. The Bell state $|\Phi^+\rangle$ is defined as:

$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$

\begin{theorem}
For any Bell state $|\psi\rangle$, measuring one qubit immediately determines the state of the other, regardless of spatial separation.
\end{theorem}

\begin{proof}
Let $|\psi\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$. Measuring the first qubit in the computational basis yields $|0\rangle$ with probability $\frac{1}{2}$, collapsing the joint state to $|00\rangle$. Similarly, obtaining $|1\rangle$ collapses the state to $|11\rangle$. In both cases, the second qubit's state is uniquely determined.
\end{proof}

\subsection{Entanglement Entropy}
The von Neumann entropy of the reduced density matrix $\rho_A$ quantifies entanglement:

$$S(\rho_A) = -\text{Tr}(\rho_A \log_2 \rho_A)$$

For a maximally entangled Bell state, $S(\rho_A) = 1$ ebit.

\section{Quantum Circuit Implementation}
We implemented the quantum circuit using standard gates:

\begin{enumerate}
\item Apply Hadamard gate $H$ to qubit 1
\item Apply CNOT gate with qubit 1 as control
\item Measure both qubits
\end{enumerate}

The resulting state after step 2 is:

$$\text{CNOT}(H \otimes I)|00\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$

\section{Conclusion}
Quantum entanglement remains one of the most fascinating phenomena in physics. Its applications in quantum computing, quantum cryptography, and quantum teleportation continue to drive research forward.

\begin{thebibliography}{9}
\bibitem{einstein1935} A. Einstein, B. Podolsky, N. Rosen, \textit{Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?}, Physical Review, vol. 47, pp. 777--780, 1935.
\bibitem{bell1964} J. S. Bell, \textit{On the Einstein Podolsky Rosen Paradox}, Physics Physique Fizika, vol. 1, no. 3, pp. 195--200, 1964.
\bibitem{nielsen2010} M. A. Nielsen, I. L. Chuang, \textit{Quantum Computation and Quantum Information}, Cambridge University Press, 2010.
\end{thebibliography}

\end{document}
```

- [ ] **Step 3: Commit**

```bash
git add articles/quantum-entanglement/metadata.json articles/quantum-entanglement/main.tex
git commit -m "content: add sample quantum entanglement article"
```

---

## Task 12: Build Verification

- [ ] **Step 1: Run the dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000` — verify homepage shows author profile and article list.
Open `http://localhost:3000/articles/quantum-entanglement` — verify article renders with:
- Title, author, date header
- Abstract with "Abstract—" label
- IEEE-style section numbering (I., II., III., IV.)
- KaTeX-rendered math equations
- Theorem and proof environments
- Enumerated list
- Bibliography with [1], [2], [3] citations

- [ ] **Step 2: Run build to verify static generation**

```bash
npm run build
```

Expected: Build succeeds with static pages generated for `/` and `/articles/quantum-entanglement`.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete science blog with LaTeX rendering engine"