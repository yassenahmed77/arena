"use client";

import React, { useState } from "react";
import Arena from "@/components/Arena";
import Checklist from "@/components/Checklist";
import Shopify from "@/components/Shopify";
import Courses from "@/components/Courses";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"arena" | "checklist" | "shopify" | "courses">("arena");

  return (
    <main className="max-w-[820px] mx-auto px-6 py-8 min-h-screen flex flex-col justify-between">
      <div className="space-y-6">
        {/* Top row */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* ARENA Logo */}
              <img
                src="/arena-icon.svg"
                alt="ARENA Logo"
                className="w-9 h-9 rounded-lg object-contain flex-shrink-0"
              />
              <h1 className="font-heading font-bold text-3xl tracking-tight text-text">
                ARENA
              </h1>
            </div>
            <p className="text-xs font-mono text-text-dim mt-1.5 max-w-[500px]">
              Code sparring + daily checklist + Shopify mastery + courses tracker. One place, everything you build lives here.
            </p>
          </div>

          {/* Spacious Pill Tab Switcher */}
          <nav className="inline-flex items-center gap-1.5 p-1.5 bg-panel border border-line rounded-full flex-shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("arena")}
              className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 font-mono text-xs font-bold rounded-full transition-all duration-150 ${
                activeTab === "arena"
                  ? "bg-accent text-bg"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Arena
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 font-mono text-xs font-bold rounded-full transition-all duration-150 ${
                activeTab === "checklist"
                  ? "bg-accent text-bg"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => setActiveTab("shopify")}
              className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 font-mono text-xs font-bold rounded-full transition-all duration-150 ${
                activeTab === "shopify"
                  ? "bg-accent text-bg"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Shopify
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`min-h-[36px] px-3.5 sm:px-4 py-1.5 font-mono text-xs font-bold rounded-full transition-all duration-150 ${
                activeTab === "courses"
                  ? "bg-accent text-bg"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Courses
            </button>
          </nav>
        </header>

        {/* Tab Content */}
        {activeTab === "arena" ? (
          <Arena />
        ) : activeTab === "checklist" ? (
          <Checklist />
        ) : activeTab === "shopify" ? (
          <Shopify />
        ) : (
          <Courses />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-text-dim py-8 mt-6">
        saved on this device · resets available above
      </footer>
    </main>
  );
}
