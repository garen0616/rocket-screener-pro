"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export function MarkdownCard({ title, md }: { title: string; md: string }) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {md || ""}
        </ReactMarkdown>
      </article>
    </div>
  );
}
