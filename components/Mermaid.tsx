"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
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
          const errorMessage = err instanceof Error ? err.message : "Failed to render diagram";
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
      <div className="p-4 my-4 bg-red-950/20 border border-red-900/50 rounded-lg text-red-400 text-sm font-mono overflow-x-auto">
        <pre className="text-xs">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex justify-center my-6 py-4 border border-dashed border-gray-700/50 rounded-lg text-sm text-gray-500 animate-pulse font-mono">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6 overflow-x-auto w-full">
      <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
