export type TokenType =
  | "COMMAND"
  | "BRACE_OPEN"
  | "BRACE_CLOSE"
  | "BRACKET_OPEN"
  | "BRACKET_CLOSE"
  | "MATH_INLINE"
  | "MATH_DISPLAY"
  | "ENVIRONMENT_BEGIN"
  | "ENVIRONMENT_END"
  | "TEXT"
  | "NEWLINE"
  | "AMPERSAND"
  | "LINEBREAK";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  author: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "published";
  published_at: string;
  entrypoint: string;
}

export interface DocumentNode {
  type: "document";
  preamble: {
    title?: ASTNode[];
    author?: ASTNode[];
    date?: ASTNode[];
  };
  content: ASTNode[];
}

export interface TextNode {
  type: "text";
  value: string;
}

export interface ParagraphNode {
  type: "paragraph";
  content: ASTNode[];
}

export interface SectionNode {
  type: "section";
  title: ASTNode[];
  content: ASTNode[];
}

export interface SubsectionNode {
  type: "subsection";
  title: ASTNode[];
  content: ASTNode[];
}

export interface SubsubsectionNode {
  type: "subsubsection";
  title: ASTNode[];
  content: ASTNode[];
}

export interface TitleNode {
  type: "title";
  content: ASTNode[];
}

export interface AuthorNode {
  type: "author";
  content: ASTNode[];
}

export interface DateNode {
  type: "date";
  content: ASTNode[];
}

export interface MaketitleNode {
  type: "maketitle";
}

export interface AbstractNode {
  type: "abstract";
  content: ASTNode[];
}

export interface TextStyleNode {
  type: "textstyle";
  style: "textbf" | "textit" | "emph" | "underline" | "texttt" | "textrm";
  content: ASTNode[];
}

export interface MathInlineNode {
  type: "math_inline";
  latex: string;
}

export interface MathDisplayNode {
  type: "math_display";
  latex: string;
  environment?: string; // e.g. 'equation', 'align', 'gather', 'cases'
}

export interface ItemizeNode {
  type: "itemize";
  items: ASTNode[]; // can contain ItemNode
}

export interface EnumerateNode {
  type: "enumerate";
  items: ASTNode[]; // can contain ItemNode
}

export interface ItemNode {
  type: "item";
  label?: string;
  content: ASTNode[];
}

export interface TheoremNode {
  type: "theorem";
  envType: "theorem" | "lemma" | "definition" | "corollary" | "remark";
  content: ASTNode[];
}

export interface ProofNode {
  type: "proof";
  content: ASTNode[];
}

export interface FigureNode {
  type: "figure";
  content: ASTNode[]; // can contain ImageNode, CaptionNode, etc.
  caption?: ASTNode[];
}

export interface ImageNode {
  type: "image";
  src: string;
  options?: string;
}

export interface TableNode {
  type: "table";
  content: ASTNode[];
  caption?: ASTNode[];
}

export interface TabularNode {
  type: "tabular";
  colsSpec: string;
  rows: ASTNode[][][]; // row -> col -> ASTNode[]
}

export interface LabelNode {
  type: "label";
  label: string;
}

export interface RefNode {
  type: "ref";
  label: string;
}

export interface CiteNode {
  type: "cite";
  keys: string[];
}

export interface BibliographyNode {
  type: "bibliography";
  items: ASTNode[]; // Should be BibitemNode[]
}

export interface BibitemNode {
  type: "bibitem";
  key: string;
  content: ASTNode[];
}

export interface FootnoteNode {
  type: "footnote";
  content: ASTNode[];
}

export interface HrefNode {
  type: "href";
  url: string;
  content: ASTNode[];
}

export interface UrlNode {
  type: "url";
  url: string;
}

export interface LinebreakNode {
  type: "linebreak";
}

export interface AmpersandNode {
  type: "ampersand";
}

export interface NewlineNode {
  type: "newline";
}

export interface DocumentBodyNode {
  type: "document_body";
  content: ASTNode[];
}

export interface CaptionNode {
  type: "caption";
  content: ASTNode[];
}

export type ASTNode =
  | DocumentNode
  | TextNode
  | ParagraphNode
  | SectionNode
  | SubsectionNode
  | SubsubsectionNode
  | TitleNode
  | AuthorNode
  | DateNode
  | MaketitleNode
  | AbstractNode
  | TextStyleNode
  | MathInlineNode
  | MathDisplayNode
  | ItemizeNode
  | EnumerateNode
  | ItemNode
  | TheoremNode
  | ProofNode
  | FigureNode
  | ImageNode
  | TableNode
  | TabularNode
  | LabelNode
  | RefNode
  | CiteNode
  | BibliographyNode
  | BibitemNode
  | FootnoteNode
  | HrefNode
  | UrlNode
  | LinebreakNode
  | AmpersandNode
  | NewlineNode
  | DocumentBodyNode
  | CaptionNode;

