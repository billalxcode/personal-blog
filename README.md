# Academic Science Journal & Portfolio Blog

A static personal blog and software portfolio built with Next.js 16 (App Router) and styled to resemble an **IEEE academic paper preprint**.

Content is dual-format: casual **Articles** authored in MDX and formal **Journals** authored in pure LaTeX (`.tex`), the latter processed by a custom server-side parsing engine (`Tokenizer -> AST -> React Renderer`) and rendered to static semantic HTML using KaTeX for math (zero client-side JS for journal pages).

---

## 🛠 Features

1. **LaTeX Engine**: Custom parser pipeline (`Tokenizer -> AST -> React Renderer`) for native LaTeX commands in journals.
2. **KaTeX Integration**: High-performance SSR math rendering for inline (`$...$`) and display (`$$...$$` and `\[...\]`) equations.
3. **MDX Articles**: GFM + syntax highlighting + Mermaid diagrams + GitHub-style alerts (`[!NOTE]`) for casual articles.
4. **IEEE Formatting**: B&W stylesheet with serif typography (STIX Two Text fallback), abstract sections, Roman-numbered headings, theorem/proof cards, footnote anchors, and hanging-indent citation listings.
5. **Research Portfolio**: Homepage showcase for systems and software projects, with descriptions, tags, visual diagrams, and code repository links.
6. **Static Site Generation (SSG)**: Fast pages pre-rendered at build-time using dynamic segment routing for both `articles` and `journals`.

---

## 📂 Project Structure

```text
personal-blog/
├── app/
│   ├── layout.tsx              # Root HTML layout (B&W theme, serif fonts)
│   ├── page.tsx                # Homepage: AuthorProfile + ArticleList + JournalList + ProjectList
│   ├── globals.css             # IEEE stylesheet & portfolio layout rules
│   ├── sitemap.ts / robots.ts  # SEO routes
│   ├── sitemap/page.tsx        # Human-readable sitemap
│   ├── articles/[slug]/
│   │   ├── page.tsx            # Dynamic route for MDX articles
│   │   └── opengraph-image.tsx # OG image generation (Lora font)
│   └── journals/[slug]/
│       ├── page.tsx            # Dynamic route for LaTeX journals
│       └── images/[filename]/route.ts # Serves journal local assets
├── articles/                   # MDX content
│   └── [slug]/
│       └── content.mdx         # MDX with frontmatter (title, date, tags, status)
├── journals/                   # LaTeX content
│   └── [slug]/
│       ├── metadata.json       # Journal config (title, slug, author, dates, entrypoint)
│       ├── main.tex            # LaTeX document body
│       └── images/             # Local figures (served via /journals/[slug]/images/*)
├── components/                 # Shared React layouts (AuthorProfile, ArticleList, JournalList, MDXContent, etc.)
├── config/
│   └── site.ts                 # Global metadata, author details, and portfolio items
└── lib/
    ├── mdx.ts                  # Filesystem helpers for MDX articles
    ├── journals.ts             # Filesystem helpers for LaTeX journals
    └── latex-parser/           # LaTeX engine (types, tokenizer, parser, renderer, katex-bridge)
```

---

## 📝 Authoring Content

### Articles (MDX) - casual posts

Create a folder inside `articles/`:

1. **Create Directory**: `articles/my-new-post/`
2. **Add Content** (`content.mdx`) with frontmatter:
   ```md
   ---
   title: "My New Post"
   author: "Billal Fauzan"
   date: "2026-06-15"
   status: "published"
   description: "Short description for SEO"
   tags: ["nextjs", "mdx"]
   ---

   ## Hello
   Your markdown content here...
   ```
   Supports GFM, code blocks, Mermaid (` ```mermaid `), and alerts (`> [!NOTE]`).

### Journals (LaTeX) - formal papers

Create a folder inside `journals/`:

1. **Create Directory**: `journals/my-new-research/`
2. **Add Metadata** (`metadata.json`):
   ```json
   {
     "title": "On the Architecture of Neural Network Layers",
     "slug": "my-new-research",
     "author": "Billal Fauzan",
     "created_at": "2026-06-15",
     "updated_at": "2026-06-15",
     "status": "published",
     "published_at": "2026-06-15",
     "entrypoint": "main.tex"
   }
   ```
   > `slug` must match the folder name.
3. **Write Document** (`main.tex`): Standard LaTeX. Supported: `\section`, `\subsection`, lists (`itemize`, `enumerate`), math envs (`equation`, `align`), cross-refs (`\label`, `\ref`, `\cite`), theorem/proof, `\includegraphics`, `tabular`, `thebibliography`/`\bibitem`.

---

## 🚀 Getting Started

First, install dependencies:

```bash
bun install
```

### Commands

- **Development Server**: `bun run dev`
- **Build Static Site**: `bun run build` (Pre-renders all static paths in `articles/` and `journals/`)
- **Lint Check**: `bun run lint`
