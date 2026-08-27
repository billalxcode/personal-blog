"use client";

import dynamic from "next/dynamic";
import React from "react";

const Mermaid = dynamic(() => import("./Mermaid"), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function MermaidWrapper({ code }: { code: string }) {
  return <Mermaid code={code} />;
}
