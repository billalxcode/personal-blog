import { tokenize } from "@/lib/latex-parser/tokenizer";
import { parse } from "@/lib/latex-parser/parser";
import { renderDocument } from "@/lib/latex-parser/renderer";

interface JournalRendererProps {
  source: string;
  slug: string;
}

export function JournalRenderer({ source, slug }: JournalRendererProps) {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  const content = renderDocument(ast, slug);

  return <article className="latex-article">{content}</article>;
}
