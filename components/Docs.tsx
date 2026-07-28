"use client";

import React, { useState } from "react";
import { JS_ARRAY_METHODS_DOCS, ArrayMethodDoc } from "@/lib/docsData";

const CATEGORIES = [
  "All",
  "Transformation",
  "Search",
  "Iteration",
  "Mutating",
  "Inspection",
  "String & Join",
  "Advanced",
];

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  const handleCopyCode = (name: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedMethod(name);
    setTimeout(() => setCopiedMethod(null), 2000);
  };

  const filteredDocs = JS_ARRAY_METHODS_DOCS.filter((doc) => {
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.useCase.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Header & Search Bar */}
      <div className="bg-panel border border-line rounded-lg p-5 space-y-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-text">
            JavaScript Reference Cheatsheet
          </h2>
          <p className="text-xs font-mono text-text-dim mt-0.5">
            Complete guide for {JS_ARRAY_METHODS_DOCS.length} JavaScript Array Methods with code examples & real system use cases.
          </p>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by method name or use case (e.g. map, reduce, cart, stock)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full min-h-[42px] bg-bg border border-line rounded px-4 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
        />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[30px] px-3 py-1 text-xs font-mono rounded-full border transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-accent text-bg font-bold border-accent"
                  : "bg-panel-2 text-text-dim border-line hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Docs Cards Grid */}
      <div className="space-y-5">
        {filteredDocs.length === 0 ? (
          <div className="bg-panel border border-line rounded-lg py-12 text-center text-text-dim text-sm font-mono italic">
            No JS Array methods found matching your search query.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.name}
              className="bg-panel border border-line rounded-lg p-5 space-y-4 transition-colors"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-bold text-xl text-accent">
                    Array.prototype.{doc.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded border border-line bg-panel-2 text-text-dim">
                    {doc.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      doc.isMutating
                        ? "bg-fail/10 text-fail border-fail/30"
                        : "bg-pass/10 text-pass border-pass/30"
                    }`}
                  >
                    {doc.isMutating ? "MUTATING" : "IMMUTABLE"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-text leading-relaxed">
                {doc.description}
              </p>

              {/* Syntax */}
              <div className="text-xs font-mono text-text-dim bg-bg p-2.5 rounded border border-line/60">
                <span className="text-accent font-bold">Syntax: </span>
                <span>{doc.syntax}</span>
              </div>

              {/* Example Code Block with Copy */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
                    Example Code:
                  </span>
                  <button
                    onClick={() => handleCopyCode(doc.name, doc.exampleCode)}
                    className="text-[11px] font-mono text-accent hover:underline focus:outline-none"
                  >
                    {copiedMethod === doc.name ? "✓ Copied!" : "📋 Copy Code"}
                  </button>
                </div>
                <pre className="p-4 bg-bg border border-line rounded font-mono text-xs text-text overflow-x-auto whitespace-pre-wrap">
                  <code>{doc.exampleCode}</code>
                </pre>
              </div>

              {/* Output */}
              <div className="p-3 bg-panel-2 border-l-4 border-accent text-xs font-mono text-text rounded-r space-y-1">
                <span className="text-accent font-bold block">// Expected Output:</span>
                <pre className="text-text-dim whitespace-pre-wrap"><code>{doc.output}</code></pre>
              </div>

              {/* Real System Use Case */}
              <div className="p-3.5 bg-accent/10 border border-accent/30 rounded text-xs font-mono text-text">
                <span className="text-accent font-bold block mb-1">💡 Real System Use Case:</span>
                <span>{doc.useCase}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
