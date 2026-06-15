# Academic Science Journal & Portfolio Blog

A static personal blog and software portfolio built with Next.js 16 (App Router) and styled to resemble an **IEEE academic paper preprint**. 

All article content is authored in pure LaTeX (`.tex`), processed by a custom server-side parsing engine, and rendered directly to static semantic HTML, using KaTeX for server-side mathematical formula rendering (zero client-side JavaScript required for content pages).

---

## 🛠 Features

1. **LaTeX Engine**: A custom built-in parser pipeline (`Tokenizer -> AST -> React Renderer`) parsing native LaTeX commands.
2. **KaTeX Integration**: High-performance SSR math formula rendering for inline (`$...$`) and display (`$$...$$` and `\[...\]`) equations.
3. **IEEE Formatting**: B&W stylesheet with serif typography (STIX Two Text fallback), abstract sections, Roman-numbered headings, theorem/proof cards, footnote anchors, and hanging-indent citation listings.
4. **Research Portfolio**: Homepage showcase for systems and software projects, with descriptions, tags, visual diagrams, and code repository links.
5. **Static Site Generation (SSG)**: Fast pages pre-rendered at build-time using dynamic segment routing.

---

## 📂 Project Structure

```text
personal-blog/
├── app/
│   ├── layout.tsx              # Root HTML layout (B&W theme, serif fonts)
│   ├── page.tsx                # Homepage rendering profile, articles, and projects
│   ├── globals.css             # IEEE stylesheet & portfolio layout rules
│   └── articles/
│       └── [slug]/
│           ├── page.tsx        # Dynamic route for rendering LaTeX articles
│           └── images/         # Route handler for serving local article assets
├── articles/                   # Content directory
│   └── [slug]/
│       ├── metadata.json       # Article configurations (title, status, date, entrypoint)
│       └── main.tex            # Document body in LaTeX format
├── components/                 # Shared React layouts (AuthorProfile, ProjectList, etc.)
├── config/
│   └── site.ts                 # Global metadata, author details, and portfolio items
└── lib/
    ├── articles.ts             # Filesystem helpers for querying local metadata & sources
    └── latex-parser/           # LaTeX parser engine pipeline (Types, Tokenizer, Parser, Renderer)
```

---

## 📝 Authoring Articles

To publish a new paper, create a folder inside the `articles/` directory:

1. **Create Directory**: `articles/my-new-research/`
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
3. **Write Document** (`main.tex`): Write standard LaTeX articles. The parser supports section commands (`\section`, `\subsection`), lists (`itemize`, `enumerate`), math environments, cross-referencing (`\label`, `\ref`, `\cite`), theorem/proof definitions, and standard citations (`\bibitem`).

---

## 🚀 Getting Started

First, install dependencies:

```bash
bun install
```

### Commands

* **Development Server**: `bun run dev`
* **Build Static Site**: `bun run build` (Pre-renders all static paths in the `articles/` directory)
* **Lint Check**: `bun run lint`
