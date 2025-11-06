"use client";

import type { BlockContent } from "@/lib/cms/types";

interface PortableTextProps {
  content: BlockContent[] | null | undefined;
  className?: string;
}

export function PortableText({ content, className }: PortableTextProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {content.map((block, index) => {
        if (block._type !== "block") return null;

        const text = block.children.map((child) => child.text).join("");

        // Handle different styles
        switch (block.style) {
          case "h1":
            return (
              <h1 key={index} className="text-4xl font-bold mb-4">
                {text}
              </h1>
            );
          case "h2":
            return (
              <h2 key={index} className="text-3xl font-bold mb-3">
                {text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="text-2xl font-bold mb-2">
                {text}
              </h3>
            );
          case "h4":
            return (
              <h4 key={index} className="text-xl font-bold mb-2">
                {text}
              </h4>
            );
          case "blockquote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-primary pl-4 italic my-4"
              >
                {text}
              </blockquote>
            );
          default:
            return (
              <p key={index} className="mb-4">
                {text}
              </p>
            );
        }
      })}
    </div>
  );
}
