import katex from "katex";

export function renderMath(
  latex: string,
  options: { displayMode?: boolean; throwOnError?: boolean } = {}
): string {
  const { displayMode = false, throwOnError = false } = options;
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError,
      trust: true,
      strict: false,
    });
  } catch (error) {
    if (throwOnError) throw error;
    const escaped = latex
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="katex-error" title="KaTeX parse error">${escaped}</span>`;
  }
}

export function renderInlineMath(latex: string): string {
  return renderMath(latex, { displayMode: false });
}

export function renderDisplayMath(latex: string): string {
  return renderMath(latex, { displayMode: true });
}
