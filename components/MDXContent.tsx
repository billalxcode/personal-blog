import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import React from "react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import MermaidWrapper from "./MermaidWrapper";

const mdxComponents: MDXRemoteProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mdx-h1" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mdx-h2" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mdx-h3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="mdx-p" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a className="mdx-a" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mdx-ul" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mdx-ol" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="mdx-li" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="mdx-blockquote" {...props} />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code className={className ? `mdx-code ${className}` : "mdx-code"} {...props} />
  ),
  pre: ({ children, className, ...props }: React.ComponentProps<"pre">) => {
    const childrenArray = React.Children.toArray(children);
    const codeElement = childrenArray[0] as React.ReactElement;
    if (
      codeElement &&
      codeElement.props &&
      typeof codeElement.props.className === "string" &&
      codeElement.props.className.includes("language-mermaid")
    ) {
      const chartCode = typeof codeElement.props.children === "string"
        ? codeElement.props.children
        : "";
      return <MermaidWrapper code={chartCode} />;
    }
    return (
      <pre className={className ? `mdx-pre ${className}` : "mdx-pre"} {...props}>
        {children}
      </pre>
    );
  },
  hr: () => <hr className="mdx-hr" />,
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="mdx-img" alt={props.alt ?? ""} {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mdx-table-wrapper">
      <table className="mdx-table" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="mdx-th" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="mdx-td" {...props} />
  ),
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
