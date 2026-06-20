import {
  Token,
  ASTNode,
  DocumentNode,
  TokenType,
  SectionNode,
  SubsectionNode,
  SubsubsectionNode,
  TextStyleNode,
  ItemNode,
  BibitemNode,
  TheoremNode,
  CaptionNode,
} from "./types";

export function parse(tokens: Token[]): DocumentNode {
  let index = 0;
  const preamble: DocumentNode["preamble"] = {};

  function peek(n = 0): Token | undefined {
    if (index + n >= tokens.length) return undefined;
    return tokens[index + n];
  }

  function advance(n = 1) {
    index += n;
  }

  function match(type: TokenType): boolean {
    const t = peek();
    return t !== undefined && t.type === type;
  }

  function matchEnvEnd(name: string): boolean {
    const t = peek();
    return t !== undefined && t.type === "ENVIRONMENT_END" && t.value === name;
  }

  function readBraceGroupParsed(): ASTNode[] {
    if (!match("BRACE_OPEN")) return [];
    advance(); // consume {
    const content: ASTNode[] = [];
    let braceCount = 1;
    while (index < tokens.length) {
      const t = peek();
      if (!t) break;
      if (t.type === "BRACE_OPEN") braceCount++;
      if (t.type === "BRACE_CLOSE") {
        braceCount--;
        if (braceCount === 0) {
          advance(); // consume }
          break;
        }
      }
      const node = parseNode();
      if (node) content.push(node);
    }
    return content;
  }

  function readBraceGroupRaw(): string {
    if (!match("BRACE_OPEN")) return "";
    advance(); // consume {
    let braceCount = 1;
    let raw = "";
    while (index < tokens.length) {
      const t = peek();
      if (!t) break;
      if (t.type === "BRACE_OPEN") braceCount++;
      if (t.type === "BRACE_CLOSE") {
        braceCount--;
        if (braceCount === 0) {
          advance(); // consume }
          break;
        }
      }
      if (t.type === "COMMAND") {
        raw += "\\" + t.value;
      } else if (t.type === "ENVIRONMENT_BEGIN") {
        raw += "\\begin{" + t.value + "}";
      } else if (t.type === "ENVIRONMENT_END") {
        raw += "\\end{" + t.value + "}";
      } else if (t.type === "MATH_DISPLAY") {
        raw += "$$" + t.value + "$$";
      } else if (t.type === "MATH_INLINE") {
        raw += "$" + t.value + "$";
      } else if (t.type === "LINEBREAK") {
        raw += "\\\\";
      } else {
        raw += t.value;
      }
      advance();
    }
    return raw;
  }

  function readBracketGroupRaw(): string {
    if (!match("BRACKET_OPEN")) return "";
    advance(); // consume [
    let bracketCount = 1;
    let raw = "";
    while (index < tokens.length) {
      const t = peek();
      if (!t) break;
      if (t.type === "BRACKET_OPEN") bracketCount++;
      if (t.type === "BRACKET_CLOSE") {
        bracketCount--;
        if (bracketCount === 0) {
          advance(); // consume ]
          break;
        }
      }
      if (t.type === "COMMAND") {
        raw += "\\" + t.value;
      } else if (t.type === "ENVIRONMENT_BEGIN") {
        raw += "\\begin{" + t.value + "}";
      } else if (t.type === "ENVIRONMENT_END") {
        raw += "\\end{" + t.value + "}";
      } else if (t.type === "MATH_DISPLAY") {
        raw += "$$" + t.value + "$$";
      } else if (t.type === "MATH_INLINE") {
        raw += "$" + t.value + "$";
      } else if (t.type === "LINEBREAK") {
        raw += "\\\\";
      } else {
        raw += t.value;
      }
      advance();
    }
    return raw;
  }

  function readEnvironmentBodyRaw(envName: string): string {
    let raw = "";
    while (index < tokens.length) {
      if (matchEnvEnd(envName)) {
        advance(); // consume \end{envName}
        break;
      }
      const t = peek();
      if (!t) break;
      if (t.type === "COMMAND") {
        raw += "\\" + t.value;
      } else if (t.type === "ENVIRONMENT_BEGIN") {
        raw += "\\begin{" + t.value + "}";
      } else if (t.type === "ENVIRONMENT_END") {
        raw += "\\end{" + t.value + "}";
      } else if (t.type === "MATH_DISPLAY") {
        raw += "$$" + t.value + "$$";
      } else if (t.type === "MATH_INLINE") {
        raw += "$" + t.value + "$";
      } else if (t.type === "LINEBREAK") {
        raw += "\\\\";
      } else {
        raw += t.value;
      }
      advance();
    }
    return raw;
  }

  function parseUntil(
    stopCondition: (next: Token | undefined) => boolean,
  ): ASTNode[] {
    const list: ASTNode[] = [];
    while (index < tokens.length && !stopCondition(peek())) {
      const node = parseNode();
      if (node) list.push(node);
    }
    return list;
  }

  function parseNode(): ASTNode | null {
    const t = peek();
    if (!t) return null;

    if (t.type === "TEXT") {
      advance();
      return { type: "text", value: t.value };
    }

    if (t.type === "MATH_INLINE") {
      advance();
      return { type: "math_inline", latex: t.value };
    }

    if (t.type === "MATH_DISPLAY") {
      advance();
      return { type: "math_display", latex: t.value };
    }

    if (t.type === "LINEBREAK") {
      advance();
      return { type: "linebreak" };
    }

    if (t.type === "AMPERSAND") {
      advance();
      return { type: "ampersand" };
    }

    if (t.type === "NEWLINE") {
      advance();
      return { type: "newline" };
    }

    if (t.type === "COMMAND") {
      const cmdName = t.value;
      advance(); // consume command

      // Preamble metadata
      if (cmdName === "title") {
        const content = readBraceGroupParsed();
        return { type: "title", content };
      }
      if (cmdName === "author") {
        const content = readBraceGroupParsed();
        return { type: "author", content };
      }
      if (cmdName === "date") {
        const content = readBraceGroupParsed();
        return { type: "date", content };
      }
      if (cmdName === "maketitle") {
        return { type: "maketitle" };
      }

      // Sections
      if (cmdName === "section") {
        const titleContent = readBraceGroupParsed();
        const bodyContent = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "COMMAND" &&
            ["section", "subsection", "subsubsection", "bibliography"].includes(
              next.value,
            ),
        );
        return {
          type: "section",
          title: titleContent,
          content: bodyContent,
        } as SectionNode;
      }
      if (cmdName === "subsection") {
        const titleContent = readBraceGroupParsed();
        const bodyContent = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "COMMAND" &&
            ["section", "subsection", "subsubsection", "bibliography"].includes(
              next.value,
            ),
        );
        return {
          type: "subsection",
          title: titleContent,
          content: bodyContent,
        } as SubsectionNode;
      }
      if (cmdName === "subsubsection") {
        const titleContent = readBraceGroupParsed();
        const bodyContent = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "COMMAND" &&
            ["section", "subsection", "subsubsection", "bibliography"].includes(
              next.value,
            ),
        );
        return {
          type: "subsubsection",
          title: titleContent,
          content: bodyContent,
        } as SubsubsectionNode;
      }

      // Text styling
      if (
        ["textbf", "textit", "emph", "underline", "texttt", "textrm"].includes(
          cmdName,
        )
      ) {
        const content = readBraceGroupParsed();
        return {
          type: "textstyle",
          style: cmdName as TextStyleNode["style"],
          content,
        };
      }

      // Footnote
      if (cmdName === "footnote") {
        const content = readBraceGroupParsed();
        return { type: "footnote", content };
      }

      // Href and Url
      if (cmdName === "href") {
        const url = readBraceGroupRaw();
        const content = readBraceGroupParsed();
        return { type: "href", url, content };
      }
      if (cmdName === "url") {
        const url = readBraceGroupRaw();
        return { type: "url", url };
      }

      // References & Citation
      if (cmdName === "label") {
        const label = readBraceGroupRaw();
        return { type: "label", label };
      }
      if (cmdName === "ref") {
        const label = readBraceGroupRaw();
        return { type: "ref", label };
      }
      if (cmdName === "cite") {
        const keysRaw = readBraceGroupRaw();
        const keys = keysRaw.split(",").map((k) => k.trim());
        return { type: "cite", keys };
      }

      // Figure/Table details
      if (cmdName === "caption") {
        const content = readBraceGroupParsed();
        return { type: "caption", content };
      }

      // Bibitem
      if (cmdName === "bibitem") {
        const key = readBraceGroupRaw();
        const bibContent = parseUntil(
          (next) =>
            next !== undefined &&
            ((next.type === "COMMAND" && next.value === "bibitem") ||
              next.type === "ENVIRONMENT_END"),
        );
        return { type: "bibitem", key, content: bibContent } as BibitemNode;
      }

      // Figure includegraphics
      if (cmdName === "includegraphics") {
        const opts =
          peek()?.type === "BRACKET_OPEN" ? readBracketGroupRaw() : undefined;
        const src = readBraceGroupRaw();
        return { type: "image", src, options: opts };
      }

      // List item
      if (cmdName === "item") {
        const label =
          peek()?.type === "BRACKET_OPEN" ? readBracketGroupRaw() : undefined;
        const bodyContent = parseUntil(
          (next) =>
            next !== undefined &&
            ((next.type === "COMMAND" && next.value === "item") ||
              next.type === "ENVIRONMENT_END"),
        );
        return {
          type: "item",
          label,
          content: groupParagraphs(bodyContent),
        } as ItemNode;
      }

      // Ignore unsupported commands / preamble setup
      if (["documentclass", "usepackage"].includes(cmdName)) {
        readBraceGroupRaw(); // discard argument
        return null;
      }

      return null;
    }

    if (t.type === "ENVIRONMENT_BEGIN") {
      const envName = t.value;
      advance(); // consume \begin{envName}

      if (envName === "document") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "document",
        );
        if (matchEnvEnd("document")) advance();
        return { type: "document_body", content };
      }

      if (envName === "abstract") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "abstract",
        );
        if (matchEnvEnd("abstract")) advance();
        return { type: "abstract", content: groupParagraphs(content) };
      }

      // Math environments
      if (
        [
          "equation",
          "align",
          "gather",
          "cases",
          "equation*",
          "align*",
          "gather*",
        ].includes(envName)
      ) {
        const rawBody = readEnvironmentBodyRaw(envName);
        return { type: "math_display", latex: rawBody, environment: envName };
      }

      // Theorem-like environments
      if (
        ["theorem", "lemma", "definition", "corollary", "remark"].includes(
          envName,
        )
      ) {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === envName,
        );
        if (matchEnvEnd(envName)) advance();
        return {
          type: "theorem",
          envType: envName as TheoremNode["envType"],
          content: groupParagraphs(content),
        };
      }

      if (envName === "proof") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "proof",
        );
        if (matchEnvEnd("proof")) advance();
        return { type: "proof", content: groupParagraphs(content) };
      }

      // Lists
      if (envName === "itemize") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "itemize",
        );
        if (matchEnvEnd("itemize")) advance();
        return { type: "itemize", items: content };
      }
      if (envName === "enumerate") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "enumerate",
        );
        if (matchEnvEnd("enumerate")) advance();
        return { type: "enumerate", items: content };
      }

      // Figures and Tables
      if (envName === "figure") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "figure",
        );
        if (matchEnvEnd("figure")) advance();
        const captionNode = content.find((n) => n.type === "caption") as
          | CaptionNode
          | undefined;
        const filteredContent = content.filter((n) => n.type !== "caption");
        return {
          type: "figure",
          content: filteredContent,
          caption: captionNode ? captionNode.content : undefined,
        };
      }

      if (envName === "table") {
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "table",
        );
        if (matchEnvEnd("table")) advance();
        const captionNode = content.find((n) => n.type === "caption") as
          | CaptionNode
          | undefined;
        const filteredContent = content.filter((n) => n.type !== "caption");
        return {
          type: "table",
          content: filteredContent,
          caption: captionNode ? captionNode.content : undefined,
        };
      }

      if (envName === "tabular") {
        const colsSpec =
          peek()?.type === "BRACE_OPEN" ? readBraceGroupRaw() : "";
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "tabular",
        );
        if (matchEnvEnd("tabular")) advance();

        const rows: ASTNode[][][] = [];
        let currentRow: ASTNode[][] = [];
        let currentCol: ASTNode[] = [];

        for (const node of content) {
          if (node.type === "linebreak") {
            currentRow.push(currentCol);
            rows.push(currentRow);
            currentRow = [];
            currentCol = [];
          } else if (node.type === "ampersand") {
            currentRow.push(currentCol);
            currentCol = [];
          } else {
            currentCol.push(node);
          }
        }
        if (currentCol.length > 0 || currentRow.length > 0) {
          currentRow.push(currentCol);
          rows.push(currentRow);
        }

        return { type: "tabular", colsSpec, rows };
      }

      // Bibliography
      if (envName === "thebibliography") {
        if (peek()?.type === "BRACE_OPEN") {
          readBraceGroupRaw();
        }
        const content = parseUntil(
          (next) =>
            next !== undefined &&
            next.type === "ENVIRONMENT_END" &&
            next.value === "thebibliography",
        );
        if (matchEnvEnd("thebibliography")) advance();
        return { type: "bibliography", items: content };
      }

      const content = parseUntil(
        (next) =>
          next !== undefined &&
          next.type === "ENVIRONMENT_END" &&
          next.value === envName,
      );
      if (matchEnvEnd(envName)) advance();
      return { type: "paragraph", content: groupParagraphs(content) };
    }

    advance();
    return null;
  }

  function groupParagraphs(nodes: ASTNode[]): ASTNode[] {
    const result: ASTNode[] = [];
    let currentParagraph: ASTNode[] = [];

    function flush() {
      if (currentParagraph.length > 0) {
        result.push({
          type: "paragraph",
          content: [...currentParagraph],
        });
        currentParagraph = [];
      }
    }

    for (const node of nodes) {
      if (!node) continue;

      if (node.type === "newline") {
        flush();
        continue;
      }

      const isBlock = [
        "section",
        "subsection",
        "subsubsection",
        "abstract",
        "math_display",
        "itemize",
        "enumerate",
        "theorem",
        "proof",
        "figure",
        "table",
        "bibliography",
      ].includes(node.type);

      if (isBlock) {
        flush();
        result.push(node);
      } else {
        currentParagraph.push(node);
      }
    }
    flush();
    return result;
  }

  const rawNodes = parseUntil(() => false);

  const contentNodes: ASTNode[] = [];
  for (const node of rawNodes) {
    if (node.type === "title") {
      preamble.title = node.content;
    } else if (node.type === "author") {
      preamble.author = node.content;
    } else if (node.type === "date") {
      preamble.date = node.content;
    } else if (node.type === "document_body") {
      contentNodes.push(...node.content);
    } else {
      contentNodes.push(node);
    }
  }

  const groupedContent = groupParagraphs(contentNodes);

  return {
    type: "document",
    preamble,
    content: groupedContent,
  };
}
