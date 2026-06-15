# Science Blog — Design Specification

**Date:** 2025-06-15  
**Status:** Approved  

---

## 1. Overview

A static personal science blog built with Next.js 16, styled to resemble an IEEE academic paper. Content is authored in pure LaTeX (`.tex` files), parsed by a custom engine, and rendered to HTML with math expressions handled by KaTeX. No database — all content lives as files in the repository.

**URL structure:**
- Homepage: `www.journal.myweb.xyz/`
- Articles: `www.journal.myweb.xyz/articles/[slug]`

---

## 2. File Structure

```
personal-blog/
├── app/
│   ├── layout.tsx              # Root layout — serif font, B&W theme
│   ├── page.tsx                # Homepage — author profile + article list + footer
│   ├── globals.css             # IEEE-style CSS
│   └── articles/
│       └── [slug]/
│           └── page.tsx        # Article page — reads .tex, renders
├── articles/                   # Content directory (project root)
│   └── [slug]/
│       ├── metadata.json       # Article metadata
│       ├── main.tex            # Entrypoint LaTeX file
│       ├── references.bib      # (optional) bibliography
│       └── images/             # (optional) supporting images
│           └── fig1.png
├── lib/
│   ├── latex-parser/
│   │   ├── tokenizer.ts        # .tex → token stream
│   │   ├── parser.ts           # Tokens → AST
│   │   ├── renderer.tsx        # AST → React components
│   │   ├── commands.ts         # Registry of supported LaTeX commands
│   │   └── katex-bridge.ts     # Math expression → KaTeX HTML
│   └── articles.ts             # Utility: read metadata, list articles
├── components/
│   ├── ArticleRenderer.tsx     # Full article renderer component
│   ├── AuthorProfile.tsx       # Author profile on homepage
│   ├── ArticleList.tsx         # Article list on homepage
│   └── Footer.tsx              # Footer component
└── config/
    └── site.ts                 # Site config (name, author info)
```

---

## 3. metadata.json Schema

```json
{
  "title": "On the Convergence of Gradient Descent in Deep Neural Networks",
  "slug": "convergence-gradient-descent",
  "author": "John Doe",
  "created_at": "2025-01-15",
  "updated_at": "2025-06-10",
  "status": "published",
  "published_at": "2025-06-10",
  "entrypoint": "main.tex"
}
```

Fields:
- `title` (string, required): Article title
- `slug` (string, required): URL-safe identifier, matches folder name
- `author` (string, required): Author name
- `created_at` (string, required): ISO date of creation
- `updated_at` (string, required): ISO date of last update
- `status` (string, required): `"draft"` or `"published"`
- `published_at` (string, required when published): ISO date of publication
- `entrypoint` (string, required): Filename of the main `.tex` file

---

## 4. LaTeX Parser Engine

### 4.1 Pipeline

```
.tex file → Tokenizer → Token Stream → Parser → AST → Renderer → React Components
```

### 4.2 Tokenizer

Breaks `.tex` source into tokens:
- `COMMAND` — `\section`, `\textbf`, etc.
- `BRACE_GROUP` — `{...}` arguments
- `BRACKET_GROUP` — `[...]` optional arguments
- `MATH_INLINE` — `$...$`
- `MATH_DISPLAY` — `$$...$$` or `\[...\]`
- `ENVIRONMENT_BEGIN` — `\begin{...}`
- `ENVIRONMENT_END` — `\end{...}`
- `TEXT` — plain text content
- `COMMENT` — `% ...` (discarded)
- `NEWLINE` — paragraph breaks (double newline)

### 4.3 Supported LaTeX Commands

**Document structure:**
- `\title{...}`, `\author{...}`, `\date{...}`, `\maketitle`
- `\begin{abstract}...\end{abstract}`
- `\section{...}`, `\subsection{...}`, `\subsubsection{...}`

**Text formatting:**
- `\textbf{...}`, `\textit{...}`, `\emph{...}`
- `\underline{...}`, `\texttt{...}`, `\textrm{...}`

**Lists:**
- `\begin{itemize}...\end{itemize}`
- `\begin{enumerate}...\end{enumerate}`
- `\item` and `\item[...]`

**Math (delegated to KaTeX):**
- Inline: `$...$`
- Display: `$$...$$`, `\[...\]`
- Environments: `equation`, `align`, `gather`, `cases`

**Theorem-like environments:**
- `theorem`, `lemma`, `proof`, `definition`, `corollary`, `remark`

**Figures and tables:**
- `\includegraphics[...]{...}`
- `figure` environment with `\caption{...}`
- `tabular` environment
- `table` environment with `\caption{...}`

**References:**
- `\label{...}`, `\ref{...}`, `\cite{...}`
- `\begin{thebibliography}...\end{thebibliography}`
- `\bibitem{...}`

**Miscellaneous:**
- `\footnote{...}`
- `\newcommand{...}{...}` (basic macro expansion)
- `\input{...}` (include another .tex file from same article folder)
- `\\` (line break)
- `\href{...}{...}` (hyperlinks)
- `\url{...}`

### 4.4 KaTeX Integration

All math content is rendered server-side using KaTeX's `renderToString()` API. This produces static HTML+CSS with no client-side JavaScript required. KaTeX CSS is included in the global stylesheet.

### 4.5 Unsupported Commands

Commands not in the supported list are silently ignored (logged in development mode). The parser does not attempt to handle:
- `\usepackage` (no package system)
- `\documentclass` (ignored)
- `\begin{document}` / `\end{document}` (treated as content boundary)
- Complex TikZ/PGF diagrams
- Custom class files

---

## 5. Styling & Layout

### 5.1 Typography
- **Font family:** Serif — Computer Modern-like web font (STIX Two Text or Latin Modern, fallback to Georgia, Times New Roman, serif)
- **Body text:** ~16px, justified
- **Title:** Bold, centered, ~24px
- **Author:** Centered, ~16px
- **Abstract:** Indented block, label "Abstract—" in bold
- **Code/monospace:** `\texttt` uses monospace font

### 5.2 Layout
- **Width:** Fixed-width centered, `max-width: 720px`
- **Margins:** Generous top/bottom padding
- **Single column** (preprint style, not two-column)

### 5.3 Colors
- Pure black and white
- Text: `#000000`
- Background: `#ffffff`
- Secondary text (dates, metadata): `#333333`
- No accent colors

### 5.4 IEEE Section Numbering
- Sections: Roman numerals — `I.`, `II.`, `III.`
- Subsections: Capital letters — `A.`, `B.`, `C.`
- Subsubsections: Arabic numerals — `1)`, `2)`, `3)`

### 5.5 Special Elements
- **Equations:** Centered, right-aligned number `(1)`, `(2)`
- **Theorem boxes:** Bold label "Theorem 1.", italic body
- **Figures:** Centered image, caption below "Fig. 1. Description"
- **Tables:** Centered, caption above "TABLE I. Description"
- **References:** Numbered `[1]`, `[2]`, slightly smaller font
- **Footnotes:** Bottom of article, superscript numbered

---

## 6. Pages

### 6.1 Homepage (`/`)
Three sections stacked vertically:

1. **Author Profile:** Name, affiliation/institution, short bio, optional photo
2. **Article List:** All published articles sorted by `published_at` descending. Each entry shows: title (linked), author, date. Drafts hidden.
3. **Footer:** Copyright notice, optional links

### 6.2 Article Page (`/articles/[slug]`)
- Reads `articles/[slug]/metadata.json` and the entrypoint `.tex` file
- Renders the full article using the LaTeX parser engine
- Page title and meta tags from metadata
- Only published articles are accessible (drafts return 404)

---

## 7. Rendering Strategy

- **Static Generation:** Uses `generateStaticParams()` to pre-render all published articles at build time
- **Server-side parsing:** LaTeX is parsed and rendered on the server — zero client-side JavaScript for content
- **KaTeX SSR:** Math rendered server-side via `katex.renderToString()`
- **Images:** Referenced from `articles/[slug]/images/`, served via Next.js public directory or custom route handler

---

## 8. Dependencies

- `katex` — Math rendering engine
- No other runtime dependencies beyond Next.js/React

---

## 9. Sample LaTeX Article

```latex
\documentclass{article}

\title{A Brief Study on Quantum Entanglement}
\author{John Doe}
\date{June 2025}

\begin{document}
\maketitle

\begin{abstract}
This paper explores the fundamental principles of quantum entanglement
and its implications for quantum computing. We present a simplified
model for understanding Bell states and their applications.
\end{abstract}

\section{Introduction}
Quantum entanglement is a phenomenon where two particles become
correlated in such a way that the quantum state of one particle
cannot be described independently of the other \cite{einstein1935}.

\section{Mathematical Framework}
Consider a two-qubit system. The Bell state $|\Phi^+\rangle$ is defined as:

$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$

\begin{theorem}
For any Bell state $|\psi\rangle$, measuring one qubit immediately
determines the state of the other, regardless of spatial separation.
\end{theorem}

\begin{proof}
Let $|\psi\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$.
Measuring the first qubit in the computational basis yields $|0\rangle$
with probability $\frac{1}{2}$, collapsing the joint state to $|00\rangle$.
\end{proof}

\section{Results}
We implemented the quantum circuit using standard gates:
\begin{enumerate}
\item Apply Hadamard gate $H$ to qubit 1
\item Apply CNOT gate with qubit 1 as control
\item Measure both qubits
\end{enumerate}

\begin{thebibliography}{9}
\bibitem{einstein1935} A. Einstein, B. Podolsky, N. Rosen,
\textit{Can Quantum-Mechanical Description of Physical Reality
Be Considered Complete?}, Physical Review, 1935.
\end{thebibliography}

\end{document}
```

---

## 10. Out of Scope

- User authentication / admin panel
- Comments system
- Search functionality
- RSS feed
- Dark mode (B&W only)
- Two-column layout
- TikZ/PGF diagram rendering
- BibTeX file parsing (manual `thebibliography` only for now)
- PDF export