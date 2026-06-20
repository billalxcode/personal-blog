import React from "react";
import Image from "next/image";
import { renderInlineMath, renderDisplayMath } from "./katex-bridge";
import { ASTNode, DocumentNode } from "./types";

interface RenderState {
  sectionCount: number;
  subsectionCount: number;
  subsubsectionCount: number;
  equationCount: number;
  theoremCount: number;
  lemmaCount: number;
  definitionCount: number;
  corollaryCount: number;
  remarkCount: number;
  figureCount: number;
  tableCount: number;
  footnotes: ASTNode[][];
  labelMap: Map<string, string>;
  citationMap: Map<string, number>;
}

function toRoman(num: number): string {
  const romanMap: { [key: number]: string } = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
    13: "XIII",
    14: "XIV",
    15: "XV",
  };
  return romanMap[num] || num.toString();
}

function toAlpha(num: number): string {
  return String.fromCharCode(64 + num);
}

export function renderDocument(
  doc: DocumentNode,
  slug: string,
): React.ReactNode {
  const labelMap = new Map<string, string>();
  const citationMap = new Map<string, number>();

  let sectionCount = 0;
  let subsectionCount = 0;
  let subsubsectionCount = 0;
  let equationCount = 0;
  let theoremCount = 0;
  let lemmaCount = 0;
  let definitionCount = 0;
  let corollaryCount = 0;
  let remarkCount = 0;
  let figureCount = 0;
  let tableCount = 0;
  let bibIndex = 1;
  let currentParentNum = "";

  function walk(node: ASTNode) {
    if (!node) return;

    if (node.type === "section") {
      sectionCount++;
      subsectionCount = 0;
      subsubsectionCount = 0;
      currentParentNum = toRoman(sectionCount);
      node.title.forEach(walk);
      node.content.forEach(walk);
    } else if (node.type === "subsection") {
      subsectionCount++;
      subsubsectionCount = 0;
      currentParentNum = toAlpha(subsectionCount);
      node.title.forEach(walk);
      node.content.forEach(walk);
    } else if (node.type === "subsubsection") {
      subsubsectionCount++;
      currentParentNum = `${subsubsectionCount})`;
      node.title.forEach(walk);
      node.content.forEach(walk);
    } else if (node.type === "math_display") {
      if (!(node.environment && node.environment.endsWith("*"))) {
        equationCount++;
        const num = `(${equationCount})`;
        const match = node.latex.match(/\\label\{([^}]+)\}/);
        if (match) {
          labelMap.set(match[1], num);
        }
      }
    } else if (node.type === "theorem") {
      let num = "";
      if (node.envType === "theorem") {
        theoremCount++;
        num = `Theorem ${theoremCount}`;
      } else if (node.envType === "lemma") {
        lemmaCount++;
        num = `Lemma ${lemmaCount}`;
      } else if (node.envType === "definition") {
        definitionCount++;
        num = `Definition ${definitionCount}`;
      } else if (node.envType === "corollary") {
        corollaryCount++;
        num = `Corollary ${corollaryCount}`;
      } else if (node.envType === "remark") {
        remarkCount++;
        num = `Remark ${remarkCount}`;
      }
      currentParentNum = num;
      node.content.forEach(walk);
    } else if (node.type === "figure") {
      figureCount++;
      currentParentNum = `Fig. ${figureCount}`;
      node.content.forEach(walk);
      if (node.caption) node.caption.forEach(walk);
    } else if (node.type === "table") {
      tableCount++;
      currentParentNum = `TABLE ${toRoman(tableCount)}`;
      node.content.forEach(walk);
      if (node.caption) node.caption.forEach(walk);
    } else if (node.type === "bibitem") {
      citationMap.set(node.key, bibIndex++);
      node.content.forEach(walk);
    } else if (node.type === "label") {
      if (currentParentNum) {
        labelMap.set(node.label, currentParentNum);
      }
    } else {
      if ("content" in node && Array.isArray(node.content)) {
        node.content.forEach(walk);
      } else if (node.type === "itemize" || node.type === "enumerate") {
        node.items.forEach(walk);
      } else if (node.type === "item") {
        node.content.forEach(walk);
      } else if (node.type === "bibliography") {
        node.items.forEach(walk);
      } else if (node.type === "tabular") {
        node.rows.forEach((r) => r.forEach((c) => c.forEach(walk)));
      }
    }
  }

  doc.content.forEach(walk);

  const state: RenderState = {
    sectionCount: 0,
    subsectionCount: 0,
    subsubsectionCount: 0,
    equationCount: 0,
    theoremCount: 0,
    lemmaCount: 0,
    definitionCount: 0,
    corollaryCount: 0,
    remarkCount: 0,
    figureCount: 0,
    tableCount: 0,
    footnotes: [],
    labelMap,
    citationMap,
  };

  return (
    <>
      {renderNodes(doc.content, state, slug)}
      {state.footnotes.length > 0 && (
        <div className="latex-footnotes">
          <hr className="footnote-separator" />
          <ol className="footnote-list">
            {state.footnotes.map((fnContent, idx) => {
              const num = idx + 1;
              return (
                <li key={idx} id={`fn-${num}`}>
                  {renderNodes(fnContent, state, slug)}{" "}
                  <a href={`#fnref-${num}`} className="footnote-backref">
                    ↩
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </>
  );
}

function renderNodes(
  nodes: ASTNode[],
  state: RenderState,
  slug: string,
): React.ReactNode {
  return nodes.map((node, index) => (
    <React.Fragment key={index}>{renderNode(node, state, slug)}</React.Fragment>
  ));
}

function renderNode(
  node: ASTNode,
  state: RenderState,
  slug: string,
): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case "text":
      return node.value;

    case "paragraph":
      return <p>{renderNodes(node.content, state, slug)}</p>;

    case "section": {
      state.sectionCount++;
      state.subsectionCount = 0;
      state.subsubsectionCount = 0;
      const numStr = toRoman(state.sectionCount);
      return (
        <div>
          <h2 className="section-title">
            {numStr}. {renderNodes(node.title, state, slug)}
          </h2>
          {renderNodes(node.content, state, slug)}
        </div>
      );
    }

    case "subsection": {
      state.subsectionCount++;
      state.subsubsectionCount = 0;
      const numStr = toAlpha(state.subsectionCount);
      return (
        <div>
          <h3 className="subsection-title">
            {numStr}. {renderNodes(node.title, state, slug)}
          </h3>
          {renderNodes(node.content, state, slug)}
        </div>
      );
    }

    case "subsubsection": {
      state.subsubsectionCount++;
      const numStr = `${state.subsubsectionCount})`;
      return (
        <div>
          <h4 className="subsubsection-title">
            {numStr} {renderNodes(node.title, state, slug)}
          </h4>
          {renderNodes(node.content, state, slug)}
        </div>
      );
    }

    case "abstract":
      return (
        <div className="abstract">
          <span className="abstract-label">Abstract—</span>
          {renderNodes(node.content, state, slug)}
        </div>
      );

    case "textstyle": {
      const children = renderNodes(node.content, state, slug);
      switch (node.style) {
        case "textbf":
          return <strong>{children}</strong>;
        case "textit":
        case "emph":
          return <em>{children}</em>;
        case "underline":
          return (
            <span style={{ textDecoration: "underline" }}>{children}</span>
          );
        case "texttt":
          return <code>{children}</code>;
        case "textrm":
          return <span style={{ fontFamily: "serif" }}>{children}</span>;
        default:
          return children;
      }
    }

    case "math_inline": {
      const html = renderInlineMath(node.latex);
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }

    case "math_display": {
      let isEquation = true;
      if (node.environment && node.environment.endsWith("*")) {
        isEquation = false;
      }

      const cleanLatex = node.latex.replace(/\\label\{([^}]+)\}/g, "");
      const html = renderDisplayMath(cleanLatex);

      if (isEquation) {
        state.equationCount++;
        const eqNum = `(${state.equationCount})`;
        return (
          <div className="equation-wrapper">
            <span
              dangerouslySetInnerHTML={{ __html: html }}
              className="flex-1 text-center"
            />
            <span className="equation-number">{eqNum}</span>
          </div>
        );
      } else {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      }
    }

    case "itemize":
      return (
        <ul className="latex-list list-disc">
          {renderNodes(node.items, state, slug)}
        </ul>
      );

    case "enumerate":
      return (
        <ol className="latex-list list-decimal">
          {renderNodes(node.items, state, slug)}
        </ol>
      );

    case "item": {
      return (
        <li>
          {node.label && <strong>[{node.label}] </strong>}
          {renderNodes(node.content, state, slug)}
        </li>
      );
    }

    case "theorem": {
      let prefix = "";
      switch (node.envType) {
        case "theorem":
          state.theoremCount++;
          prefix = `Theorem ${state.theoremCount}.`;
          break;
        case "lemma":
          state.lemmaCount++;
          prefix = `Lemma ${state.lemmaCount}.`;
          break;
        case "definition":
          state.definitionCount++;
          prefix = `Definition ${state.definitionCount}.`;
          break;
        case "corollary":
          state.corollaryCount++;
          prefix = `Corollary ${state.corollaryCount}.`;
          break;
        case "remark":
          state.remarkCount++;
          prefix = `Remark ${state.remarkCount}.`;
          break;
      }
      return (
        <div className="theorem-env">
          <div className="theorem-head">{prefix}</div>
          <div className="theorem-body">
            {renderNodes(node.content, state, slug)}
          </div>
        </div>
      );
    }

    case "proof":
      return (
        <div className="proof-env">
          <div className="proof-head">
            <em>Proof:</em>
          </div>
          <div className="proof-body">
            {renderNodes(node.content, state, slug)}
          </div>
          <div className="qed">■</div>
        </div>
      );

    case "figure": {
      state.figureCount++;
      return (
        <figure className="latex-figure">
          {renderNodes(node.content, state, slug)}
          {node.caption && (
            <figcaption className="latex-caption">
              Fig. {state.figureCount}. {renderNodes(node.caption, state, slug)}
            </figcaption>
          )}
        </figure>
      );
    }

    case "table": {
      state.tableCount++;
      const numStr = toRoman(state.tableCount);
      return (
        <div className="latex-table-wrapper text-center">
          {node.caption && (
            <div className="latex-caption">
              TABLE {numStr}. {renderNodes(node.caption, state, slug)}
            </div>
          )}
          {renderNodes(node.content, state, slug)}
        </div>
      );
    }

    case "image": {
      const imageUrl = node.src.startsWith("/")
        ? node.src
        : `/articles/${slug}/images/${node.src}`;
      return (
        <div className="relative w-full h-[400px] my-4">
          <Image
            src={imageUrl}
            alt="LaTeX Figure"
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            className="object-contain"
          />
        </div>
      );
    }

    case "tabular": {
      return (
        <div className="latex-table-wrapper">
          <table className="latex-tabular">
            <tbody>
              {node.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((col, cIdx) => (
                    <td key={cIdx}>{renderNodes(col, state, slug)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "label":
      return <span id={`label-${node.label}`} />;

    case "ref": {
      const val = state.labelMap.get(node.label) || "?";
      return (
        <a href={`#label-${node.label}`} className="latex-ref">
          {val}
        </a>
      );
    }

    case "cite": {
      const keyElements = node.keys.map((key, kIdx) => {
        const idx = state.citationMap.get(key);
        return (
          <React.Fragment key={key}>
            {kIdx > 0 && ", "}
            <a href={`#cite-${key}`} className="latex-cite-link">
              {idx !== undefined ? idx : "?"}
            </a>
          </React.Fragment>
        );
      });
      return <span className="latex-cite">[{keyElements}]</span>;
    }

    case "bibliography":
      return (
        <div className="latex-bibliography">
          <h2 className="section-title">References</h2>
          <ul className="bib-list" style={{ paddingLeft: 0 }}>
            {renderNodes(node.items, state, slug)}
          </ul>
        </div>
      );

    case "bibitem": {
      const idx = state.citationMap.get(node.key) || 1;
      return (
        <li
          id={`cite-${node.key}`}
          className="bib-item"
          style={{
            listStyle: "none",
            textIndent: "-1.5em",
            paddingLeft: "1.5em",
            marginBottom: "0.5rem",
            textAlign: "justify",
          }}
        >
          [{idx}] {renderNodes(node.content, state, slug)}
        </li>
      );
    }

    case "footnote": {
      const fnIndex = state.footnotes.length + 1;
      state.footnotes.push(node.content);
      return (
        <sup className="footnote-ref">
          <a href={`#fn-${fnIndex}`} id={`fnref-${fnIndex}`}>
            {fnIndex}
          </a>
        </sup>
      );
    }

    case "href":
      return (
        <a
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {renderNodes(node.content, state, slug)}
        </a>
      );

    case "url":
      return (
        <a
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="latex-url underline"
        >
          {node.url}
        </a>
      );

    case "linebreak":
      return <br />;

    default:
      return null;
  }
}
