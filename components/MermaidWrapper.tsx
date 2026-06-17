"use client";

import dynamic from "next/dynamic";
import React from "react";

const Mermaid = dynamic(() => import("./Mermaid"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center my-6 py-4 border border-dashed border-gray-700/50 rounded-lg text-sm text-gray-500 animate-pulse font-mono">
      Rendering diagram...
    </div>
  ),
});

export default function MermaidWrapper({ code }: { code: string }) {
  return <Mermaid code={code} />;
}
