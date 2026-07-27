"use client";

import React, { useState, useEffect } from "react";
import {
  SHOPIFY_MODULES,
  ShopifyModule,
  ShopifyProgressState,
  ShopifyLogEntry,
  loadShopifyProgress,
  saveShopifyProgress,
  callClaudeApi,
} from "@/lib/storage";
import {
  ShopifyTaskResponse,
  getLocalShopifyTask,
  generateLocalShopifyReview,
} from "@/lib/shopifyTasks";

export default function Shopify() {
  const [progress, setProgress] = useState<ShopifyProgressState>({
    currentModuleIndex: 0,
    masteredModuleIds: [],
    log: [],
  });
  const [showLog, setShowLog] = useState(false);
  const [expandedAnswerIdx, setExpandedAnswerIdx] = useState<number | null>(null);

  // Current Task State
  const [taskData, setTaskData] = useState<ShopifyTaskResponse | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Review State
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    feedback: string;
    mastered: boolean;
  } | null>(null);

  useEffect(() => {
    const loaded = loadShopifyProgress();
    setProgress(loaded);
    fetchTaskForModule(loaded.currentModuleIndex, 0);
  }, []);

  const currentModule: ShopifyModule =
    SHOPIFY_MODULES[progress.currentModuleIndex] || SHOPIFY_MODULES[0];

  const fetchTaskForModule = async (moduleIndex: number, iteration: number) => {
    setIsGenerating(true);
    setAnswer("");
    setReviewResult(null);
    setShowHint(false);

    const mod = SHOPIFY_MODULES[moduleIndex] || SHOPIFY_MODULES[0];

    try {
      const systemPrompt = `You are a Shopify development mentor building a practical, hands-on curriculum for Yaseen who is pivoting toward Shopify freelancing (theme + app dev for merchant clients).

Generate ONE short, numbered build walkthrough (3-6 concrete ordered steps) for a real piece of Shopify work belonging to this module's focus. Frame it as "do this in your dev store / theme code," referencing real Shopify files (e.g. product.liquid, sections/header.liquid, schema.json), APIs, CLI commands, or Liquid objects.

Respond ONLY with raw JSON (no markdown fences):
{
  "title": "string, Franco-Arabic, short — names the real thing being built (e.g. 'Sale Badge on Product Page')",
  "steps": ["step 1 description in Franco-Arabic", "step 2...", "step 3..."],
  "appliesTo": "string, Franco-Arabic, one line — which part of a real client site this maps to (e.g. 'أي theme فيه منتجات عليها خصم')",
  "expectedFormat": "code"|"explanation"|"mixed"
}`;

      const userPrompt = `Module title: ${mod.title}. Focus: ${mod.focus}.${
        iteration > 0 ? " Generate a DIFFERENT real-world build walkthrough than last time." : ""
      }`;

      const apiTask = await callClaudeApi(systemPrompt, userPrompt);
      if (apiTask && apiTask.title && Array.isArray(apiTask.steps)) {
        setTaskData(apiTask);
        setIsGenerating(false);
        return;
      }
    } catch (e) {
      // Fallback to local problem bank
    }

    const localTask = getLocalShopifyTask(mod, iteration);
    setTaskData(localTask);
    setIsGenerating(false);
  };

  const handleRegenerateTask = () => {
    const nextIter = taskCount + 1;
    setTaskCount(nextIter);
    fetchTaskForModule(progress.currentModuleIndex, nextIter);
  };

  const handleSubmitReview = async () => {
    if (!taskData || !answer.trim()) return;
    setIsReviewing(true);

    let review = generateLocalShopifyReview(currentModule, answer);

    try {
      const systemPrompt = `You are a direct, no-fluff Shopify mentor reviewing Yaseen's submission for a specific curriculum module.

Review Yaseen's submission AGAINST the required build steps listed below. Check if he followed the sequence, hit the real Shopify concepts named in each step, and produced a solution that would actually work on a live theme/store.

Respond in Franco-Arabic, short and practical — what's correct, what's wrong or missing, and one concrete fix.
Only mark "mastered": true if the submission genuinely demonstrates step completion and competency for live client sites.

Respond ONLY with raw JSON (no markdown fences):
{"feedback": "string (Franco-Arabic, 2-5 sentences)", "mastered": boolean}`;

      const stepsList = taskData.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
      const userPrompt = `Module: ${currentModule.title} (${currentModule.focus}).\nTask Title: ${taskData.title}\nApplies To: ${taskData.appliesTo}\nRequired Steps:\n${stepsList}\n\nUser Submission:\n${answer}`;

      const apiReview = await callClaudeApi(systemPrompt, userPrompt);
      if (apiReview && typeof apiReview.mastered === "boolean") {
        review = apiReview;
      }
    } catch (e) {
      // Fallback to local review generator
    }

    setReviewResult(review);

    let newMasteredIds = [...progress.masteredModuleIds];
    let newModuleIndex = progress.currentModuleIndex;

    if (review.mastered) {
      if (!newMasteredIds.includes(currentModule.id)) {
        newMasteredIds.push(currentModule.id);
      }
      if (progress.currentModuleIndex < SHOPIFY_MODULES.length - 1) {
        newModuleIndex = progress.currentModuleIndex + 1;
      }
    }

    const newLogEntry: ShopifyLogEntry = {
      moduleId: currentModule.id,
      moduleTitle: currentModule.title,
      task: `${taskData.title}: ${taskData.steps[0] || ""}`,
      feedback: review.feedback,
      mastered: review.mastered,
      date: new Date().toISOString(),
      answer: answer,
    };

    const newLog = [newLogEntry, ...progress.log].slice(0, 50);

    const updatedProgress: ShopifyProgressState = {
      currentModuleIndex: newModuleIndex,
      masteredModuleIds: newMasteredIds,
      log: newLog,
    };

    setProgress(updatedProgress);
    saveShopifyProgress(updatedProgress);
    setIsReviewing(false);
  };

  const handleNextModule = () => {
    fetchTaskForModule(progress.currentModuleIndex, 0);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Module Progress Rail Card */}
      <div className="bg-panel border border-line rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-text">
              Shopify Curriculum
            </h2>
            <div className="text-xs font-mono text-text-dim mt-0.5">
              Module {progress.currentModuleIndex + 1} of {SHOPIFY_MODULES.length} ·{" "}
              {progress.masteredModuleIds.length} Mastered
            </div>
          </div>
          <button
            onClick={() => setShowLog(!showLog)}
            className="min-h-[36px] px-3.5 py-1.5 text-xs font-mono text-text-dim hover:text-text border border-line hover:border-text-dim rounded transition-colors"
          >
            {showLog ? "Close Log" : "Log History"}
          </button>
        </div>

        {/* Stepped Progress Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SHOPIFY_MODULES.map((mod, idx) => {
            const isDone = progress.masteredModuleIds.includes(mod.id);
            const isCurrent = idx === progress.currentModuleIndex;
            const isLocked = idx > progress.currentModuleIndex && !isDone;

            let badgeStyle = "border-line bg-panel-2 text-text-dim";
            if (isDone) {
              badgeStyle = "border-pass/40 bg-pass/10 text-pass";
            } else if (isCurrent) {
              badgeStyle = "border-accent bg-accent/10 text-accent font-bold";
            } else if (isLocked) {
              badgeStyle = "border-line/40 bg-bg/50 text-text-dim/40 opacity-60";
            }

            return (
              <div
                key={mod.id}
                onClick={() => {
                  if (!isLocked) {
                    const updated = { ...progress, currentModuleIndex: idx };
                    setProgress(updated);
                    saveShopifyProgress(updated);
                    fetchTaskForModule(idx, 0);
                  }
                }}
                className={`p-2 rounded border text-center font-mono text-[11px] transition-colors cursor-pointer select-none flex flex-col justify-between h-[54px] ${badgeStyle}`}
                title={`${mod.title}: ${mod.focus}`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75">
                  <span>M{idx + 1}</span>
                  <span>{isDone ? "✓" : isCurrent ? "▶" : "🔒"}</span>
                </div>
                <span className="truncate font-medium text-[10px] block">
                  {mod.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submissions Log Drawer */}
      {showLog && (
        <div className="bg-panel border border-line rounded-lg p-5 animate-in fade-in duration-200">
          <div className="font-heading font-bold text-base text-text pb-3 border-b border-line mb-4">
            Shopify Submissions Log · {progress.log.length} entries
          </div>

          {progress.log.length === 0 ? (
            <div className="text-sm font-mono text-text-dim py-4 italic">
              لسه ملحلتش أي task في Shopify. جاوب على تاسك وسبمت ريفيو، هتلاقيها هنا.
            </div>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {progress.log.map((entry, idx) => {
                const isExpanded = expandedAnswerIdx === idx;
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-panel-2 border border-line rounded space-y-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-text truncate">
                        {entry.moduleTitle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          entry.mastered
                            ? "bg-pass/10 text-pass border border-pass/30"
                            : "bg-fail/10 text-fail border border-fail/30"
                        }`}
                      >
                        {entry.mastered ? "MASTERED" : "NOT MASTERED"}
                      </span>
                    </div>
                    <div className="text-text-dim text-[11px] italic truncate">
                      Task: {entry.task}
                    </div>
                    <div className="text-text text-xs leading-relaxed pt-1 border-t border-line/50">
                      {entry.feedback}
                    </div>

                    {/* Saved Answer Block */}
                    {entry.answer && (
                      <div className="pt-1">
                        <button
                          onClick={() => setExpandedAnswerIdx(isExpanded ? null : idx)}
                          className="text-[11px] font-mono text-accent hover:underline focus:outline-none flex items-center gap-1"
                        >
                          <span>{isExpanded ? "▼ Hide My Submitted Answer" : "▶ View My Submitted Answer"}</span>
                        </button>
                        {isExpanded && (
                          <pre className="mt-2 p-3 bg-bg border border-line rounded text-[11px] font-mono text-text overflow-x-auto max-h-[200px] whitespace-pre-wrap">
                            <code>{entry.answer}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Current Module Card */}
      <div className="bg-panel border border-line rounded-lg p-5 space-y-5">
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-dim font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-2" />
            </div>
            <span>loading build walkthrough…</span>
          </div>
        ) : taskData ? (
          <>
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
              <div>
                <h3 className="font-heading font-bold text-lg text-text">
                  {taskData.title || currentModule.title}
                </h3>
                <span className="text-xs font-mono text-text-dim mt-0.5 block">
                  Module: {currentModule.title}
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-line bg-panel-2 text-text-dim max-w-[300px] truncate">
                {currentModule.focus}
              </span>
            </div>

            {/* Applies To Banner */}
            {taskData.appliesTo && (
              <div className="p-3 bg-panel-2 border border-line rounded text-xs font-mono text-text">
                <span className="font-bold text-accent">📌 Applies to: </span>
                <span>{taskData.appliesTo}</span>
              </div>
            )}

            {/* Step-by-step numbered build list */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-text-dim uppercase tracking-wider block">
                Build Steps (Walkthrough):
              </span>
              <ol className="space-y-2.5 pl-4 list-decimal font-mono text-sm text-text leading-relaxed">
                {taskData.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Optional Hint Toggle */}
            {taskData.hint && (
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-mono text-accent hover:underline focus:outline-none"
                >
                  {showHint ? "Hide Hint" : "💡 Need a Hint?"}
                </button>
                {showHint && (
                  <div className="mt-2 p-3 bg-panel-2 border border-line rounded text-xs font-mono text-text-dim">
                    {taskData.hint}
                  </div>
                )}
              </div>
            )}

            {/* Answer textarea */}
            <textarea
              spellCheck={false}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ektib el-code aw el-explanation bta3ak hna le-tatbiq el-خطوات (Liquid code, schema JSON, CLI commands, GraphQL query, etc)..."
              rows={8}
              className="w-full bg-bg border border-line rounded p-4 font-mono text-sm text-text focus:outline-none focus:border-accent transition-colors resize-y"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={!answer.trim() || isReviewing}
                className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isReviewing ? "Reviewing..." : "Submit for Review"}
              </button>
              <button
                onClick={handleRegenerateTask}
                className="min-h-[38px] px-4 bg-transparent text-text-dim hover:text-text border border-line hover:border-text-dim text-xs font-mono rounded transition-colors"
              >
                New Task for This Module
              </button>
            </div>

            {/* Review Feedback Display */}
            {reviewResult && (
              <div className="space-y-4 pt-3 border-t border-line">
                <div
                  className={`p-4 bg-panel-2 border rounded space-y-2 text-xs font-mono ${
                    reviewResult.mastered
                      ? "border-pass/40"
                      : "border-fail/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold uppercase text-[11px] ${
                        reviewResult.mastered ? "text-pass" : "text-fail"
                      }`}
                    >
                      {reviewResult.mastered ? "Mastered! 🎉" : "Needs Work"}
                    </span>
                  </div>
                  <div className="text-text leading-relaxed whitespace-pre-line">
                    {reviewResult.feedback}
                  </div>
                </div>

                <div>
                  {reviewResult.mastered ? (
                    <button
                      onClick={handleNextModule}
                      className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
                    >
                      Next Module
                    </button>
                  ) : (
                    <button
                      onClick={handleRegenerateTask}
                      className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
