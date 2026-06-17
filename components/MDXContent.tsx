import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import React from "react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import MermaidWrapper from "./MermaidWrapper";
import { Info, Lightbulb, AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";

interface AlertBlockProps {
  type: string;
  children: React.ReactNode;
}

const alertConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  NOTE: {
    label: "Note",
    className: "mdx-alert-note",
    icon: <Info className="mdx-alert-icon" size={16} />,
  },
  TIP: {
    label: "Tip",
    className: "mdx-alert-tip",
    icon: <Lightbulb className="mdx-alert-icon" size={16} />,
  },
  IMPORTANT: {
    label: "Important",
    className: "mdx-alert-important",
    icon: <AlertCircle className="mdx-alert-icon" size={16} />,
  },
  WARNING: {
    label: "Warning",
    className: "mdx-alert-warning",
    icon: <AlertTriangle className="mdx-alert-icon" size={16} />,
  },
  CAUTION: {
    label: "Caution",
    className: "mdx-alert-caution",
    icon: <AlertOctagon className="mdx-alert-icon" size={16} />,
  },
};


function AlertBlock({ type, children }: AlertBlockProps) {
  const config = alertConfig[type] || alertConfig.NOTE;
  return (
    <div className={`mdx-alert ${config.className}`}>
      <div className="mdx-alert-header">
        {config.icon}
        <span>{config.label}</span>
      </div>
      <div className="mdx-alert-content">{children}</div>
    </div>
  );
}

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
  blockquote: (props: React.ComponentProps<"blockquote">) => {
    const { children, className, ...rest } = props;
    // Filter out empty text nodes / newlines so we grab the first actual content element
    const childrenArray = React.Children.toArray(children).filter(
      (child) => typeof child !== "string" || child.trim() !== ""
    );

    const firstChild = childrenArray[0];
    if (typeof firstChild === "string") {
      const match = firstChild.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
      if (match) {
        const type = match[1].toUpperCase();
        const restText = match[2];
        return (
          <AlertBlock type={type}>
            {restText.trim() !== "" ? <p>{restText}</p> : null}
            {childrenArray.slice(1)}
          </AlertBlock>
        );
      }
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(firstChild) &&
      firstChild.props &&
      firstChild.props.children
    ) {
      const firstChildChildren = React.Children.toArray(firstChild.props.children);
      const firstTextNode = firstChildChildren[0];

      if (typeof firstTextNode === "string") {
        const match = firstTextNode.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
        if (match) {
          const type = match[1].toUpperCase();
          const restText = match[2];

          const remainingFirstChildChildren = firstChildChildren.slice(1);
          const hasContentLeft = restText.trim() !== "" || remainingFirstChildChildren.length > 0;

          const updatedFirstChild = hasContentLeft
            ? React.cloneElement(
                firstChild,
                firstChild.props,
                restText ? [restText, ...remainingFirstChildChildren] : remainingFirstChildChildren
              )
            : null;

          return (
            <AlertBlock type={type}>
              {updatedFirstChild}
              {childrenArray.slice(1)}
            </AlertBlock>
          );
        }
      }
    }

    return <blockquote className={className ? `mdx-blockquote ${className}` : "mdx-blockquote"} {...rest} />;
  },
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code className={className ? `mdx-code ${className}` : "mdx-code"} {...props} />
  ),
  pre: ({ children, className, ...props }: React.ComponentProps<"pre">) => {
    const childrenArray = React.Children.toArray(children);
    const codeElement = childrenArray[0] as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
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
