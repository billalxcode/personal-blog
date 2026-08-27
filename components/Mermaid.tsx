"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#ffffff",
    primaryTextColor: "#000000",
    primaryBorderColor: "#000000",
    lineColor: "#000000",
    secondaryColor: "#f5f5f3",
    tertiaryColor: "#ffffff",
    background: "#ffffff",
    mainBkg: "#ffffff",
    errorBkgColor: "#ffffff",
    errorTextColor: "#000000",
    nodeBorder: "#000000",
    clusterBkg: "#ffffff",
    clusterBorder: "#000000",
    titleColor: "#000000",
    fontFamily: "IBM Plex Mono, monospace",
  },
});

interface MermaidProps {
  code: string;
}

export default function Mermaid({ code }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const rawId = React.useId();
  const id = rawId.replace(/:/g, "");

  useEffect(() => {
    let active = true;
    async function renderChart() {
      try {
        const cleanCode = typeof code === "string" ? code.trim() : "";
        if (!cleanCode) return;
        const { svg: renderedSvg } = await mermaid.render(id, cleanCode);
        if (active) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (active) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to render diagram";
          setError(errorMessage);
        }
      }
    }
    renderChart();

    return () => {
      active = false;
    };
  }, [code, id]);

  if (error) {
    return (
      <div
        style={{
          border: "1px solid #000",
          padding: "12px",
          margin: "16px 0",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.75rem",
          background: "#fff",
        }}
      >
        <div
          style={{
            fontVariant: "small-caps",
            letterSpacing: "0.08em",
            textTransform: "lowercase",
            fontWeight: 700,
            borderBottom: "1px solid #e5e5e5",
            paddingBottom: "4px",
            marginBottom: "6px",
          }}
        >
          Diagram Error
        </div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        style={{
          border: "1px solid #000",
          borderStyle: "dashed",
          padding: "14px",
          margin: "16px 0",
          textAlign: "center",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#444",
        }}
      >
        Rendering diagram...
      </div>
    );
  }

  return (
    <div className="mermaid-wrapper">
      <div
        className="w-full flex justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
