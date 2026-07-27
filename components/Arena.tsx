"use client";

import React, { useState, useEffect } from "react";
import {
  BELTS,
  ProgressState,
  getBeltIndex,
  loadProgress,
  saveProgress,
  callClaudeApi,
  LogEntry,
} from "@/lib/storage";
import {
  Problem,
  TestCase,
  getRandomProblem,
  generateLocalReview,
} from "@/lib/problems";

interface TestRunResult {
  input: any[];
  expected: any;
  actual?: any;
  error?: string;
  passed: boolean;
}

export default function Arena() {
  const [progress, setProgress] = useState<ProgressState>({
    solved: 0,
    weakAreas: [],
    history: [],
    log: [],
  });
  const [showProfile, setShowProfile] = useState(false);

  // Problem State
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Testing & Review State
  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [passCount, setPassCount] = useState(0);
  const [syntaxError, setSyntaxError] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    fetchNewProblem(loaded);
  }, []);

  const currentBeltIndex = getBeltIndex(progress.solved);
  const currentBelt = BELTS[currentBeltIndex];
  const nextBelt = BELTS[currentBeltIndex + 1];

  const progressPct = nextBelt
    ? Math.min(
        100,
        ((progress.solved - currentBelt.threshold) /
          (nextBelt.threshold - currentBelt.threshold)) *
          100
      )
    : 100;

  const fetchNewProblem = async (currentProg: ProgressState = progress) => {
    setIsGenerating(true);
    setProblem(null);
    setTestResults(null);
    setFeedback(null);
    setSyntaxError("");

    const beltIdx = getBeltIndex(currentProg.solved);
    const targetDiff = BELTS[beltIdx].difficulty;
    const recent = currentProg.history.slice(-6);

    try {
      // Try local generator first (100% free, instant, zero cost)
      const selectedProblem = getRandomProblem(targetDiff, recent);
      setProblem(selectedProblem);
      setCode(selectedProblem.starterCode || "");
    } catch (err) {
      console.error("Error generating problem locally:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunTests = () => {
    if (!problem) return;
    setSyntaxError("");
    setFeedback(null);

    let userFn: Function;
    try {
      const factory = new Function(
        `${code}\nreturn typeof ${problem.functionName} === 'function' ? ${problem.functionName} : null;`
      );
      const fn = factory();
      if (!fn) {
        throw new Error(`Function "${problem.functionName}" is not defined.`);
      }
      userFn = fn;
    } catch (e: any) {
      setSyntaxError(e.message || "Syntax or setup error");
      setTestResults(null);
      return;
    }

    let passed = 0;
    const results: TestRunResult[] = problem.testCases.map((tc) => {
      let actual: any;
      let ok = false;
      let errorStr = "";
      try {
        actual = userFn(...tc.input);
        ok = JSON.stringify(actual) === JSON.stringify(tc.expected);
      } catch (err: any) {
        ok = false;
        errorStr = err.message || "Execution error";
      }

      if (ok) passed++;
      return {
        input: tc.input,
        expected: tc.expected,
        actual,
        error: errorStr,
        passed: ok,
      };
    });

    setPassCount(passed);
    setTestResults(results);
  };

  const handleSubmitReview = async () => {
    if (!problem || !testResults) return;
    setIsReviewing(true);

    try {
      let review = generateLocalReview(
        problem,
        passCount,
        problem.testCases.length,
        code
      );

      // Try API if user optionally has key configured
      try {
        const systemPrompt = `You are a direct, no-fluff coding mentor reviewing a solution from a self-taught frontend developer named Yaseen. Respond in Franco-Arabic (Arabic words transliterated in Latin letters), short and practical. Respond with ONLY raw JSON, no markdown fences:
{"feedback": "Franco-Arabic, 2-5 sentences", "weakAreas": ["concept tags"], "levelUp": true|false}`;

        const userPrompt = `Problem: ${problem.title} (${problem.concept}, ${problem.difficulty}). Test results: ${passCount}/${problem.testCases.length} passed.\nSubmitted code:\n${code}`;
        const apiReview = await callClaudeApi(systemPrompt, userPrompt);
        if (apiReview && apiReview.feedback) {
          review = apiReview;
        }
      } catch (e) {
        // Fallback to local review engine cleanly
      }

      setFeedback(review.feedback);

      const allPassed = passCount === problem.testCases.length;
      let newSolved = progress.solved;
      if (allPassed && review.levelUp) {
        newSolved += 1;
      }

      let newWeakAreas = [...progress.weakAreas];
      if (review.weakAreas && Array.isArray(review.weakAreas) && review.weakAreas.length > 0) {
        newWeakAreas = [...newWeakAreas, ...review.weakAreas].slice(-10);
      }

      const newHistory = [...progress.history, problem.concept].slice(-10);

      const newLogEntry: LogEntry = {
        title: problem.title,
        concept: problem.concept,
        difficulty: problem.difficulty,
        feedback: review.feedback,
        passed: allPassed,
        date: new Date().toISOString(),
      };

      const newLog = [newLogEntry, ...(progress.log || [])].slice(0, 50);

      const updatedProgress: ProgressState = {
        solved: newSolved,
        weakAreas: newWeakAreas,
        history: newHistory,
        log: newLog,
      };

      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    } catch (err: any) {
      setFeedback(`Couldn't get a review right now: ${err.message}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const getDifficultyBadgeClass = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-pass/10 text-pass border-pass/30";
      case "medium":
        return "bg-accent/10 text-accent border-accent/30";
      case "hard":
        return "bg-fail/10 text-fail border-fail/30";
      default:
        return "bg-panel-2 text-text-dim border-line";
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Belt Bar */}
      <div className="bg-panel border border-line rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full inline-block border border-line flex-shrink-0"
                style={{ backgroundColor: currentBelt.color }}
              />
              <span className="font-heading font-bold text-lg text-text">
                {currentBelt.name}
              </span>
            </div>

            <div className="mt-2 text-xs font-mono text-text-dim">
              {nextBelt
                ? `${progress.solved} solved · ${nextBelt.threshold - progress.solved} to ${nextBelt.name}`
                : `${progress.solved} solved · max belt`}
            </div>

            {/* Belt Progress Fill */}
            <div className="w-full bg-panel-2 h-2 rounded-full overflow-hidden mt-3 border border-line">
              <div
                className="h-full bg-gradient-to-r from-accent to-[var(--yellow-belt)] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Weak Areas Tags */}
            {progress.weakAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {progress.weakAreas.slice(-5).map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-fail/10 text-fail border border-fail/20"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="min-h-[36px] px-3.5 py-1.5 text-xs font-mono text-text-dim hover:text-text border border-line hover:border-text-dim rounded transition-colors"
          >
            {showProfile ? "Close Profile" : "Profile"}
          </button>
        </div>
      </div>

      {/* Profile Drawer Card */}
      {showProfile && (
        <div className="bg-panel border border-line rounded-lg p-5 animate-in fade-in duration-200">
          <div className="font-heading font-bold text-base text-text pb-3 border-b border-line mb-4">
            Profile · {progress.log.length} reviewed
          </div>

          {progress.log.length === 0 ? (
            <div className="text-sm font-mono text-text-dim py-4 italic">
              لسه ملحلتش أي مسألة. حل مسألة وسبمت ريفيو، هتلاقيها هنا.
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {progress.log.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-panel-2 border border-line rounded space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-text truncate">{entry.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        entry.passed
                          ? "bg-pass/10 text-pass border border-pass/30"
                          : "bg-fail/10 text-fail border border-fail/30"
                      }`}
                    >
                      {entry.passed ? "PASSED" : "NOT PASSED"}
                    </span>
                  </div>
                  <div className="text-text-dim text-[11px]">
                    {entry.concept} · {entry.difficulty} ·{" "}
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="text-text text-xs leading-relaxed pt-1 border-t border-line/50">
                    {entry.feedback}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Problem Card */}
      <div className="bg-panel border border-line rounded-lg p-5 space-y-5">
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-dim font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-2" />
            </div>
            <span>generating a problem for you…</span>
          </div>
        ) : problem ? (
          <>
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
              <h3 className="font-heading font-bold text-lg text-text">
                {problem.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono px-2.5 py-0.5 rounded border uppercase ${getDifficultyBadgeClass(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-line bg-panel-2 text-text-dim">
                  {problem.concept}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm font-mono text-text leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>

            {/* Code area */}
            <textarea
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full bg-bg border border-line rounded p-4 font-mono text-sm text-text focus:outline-none focus:border-accent transition-colors resize-y"
            />

            {/* Button row */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunTests}
                className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
              >
                Run Tests
              </button>
              <button
                onClick={() => fetchNewProblem()}
                className="min-h-[38px] px-4 bg-transparent text-text-dim hover:text-text border border-line hover:border-text-dim text-xs font-mono rounded transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Syntax error banner */}
            {syntaxError && (
              <div className="p-3 bg-fail/10 border-l-4 border-fail text-fail text-xs font-mono rounded-r">
                <span className="font-bold">Setup Error:</span> {syntaxError}
              </div>
            )}

            {/* Test Results Output */}
            {testResults && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-3 bg-panel-2 text-xs font-mono rounded border-l-4 ${
                        tr.passed ? "border-pass" : "border-fail"
                      } flex items-center justify-between gap-3`}
                    >
                      <span className="text-text truncate flex-1">
                        Test {idx + 1}: ({tr.input.map((x) => JSON.stringify(x)).join(", ")})
                        {" → "}
                        expected {JSON.stringify(tr.expected)}
                        {tr.error
                          ? ` — error: ${tr.error}`
                          : ` — got ${JSON.stringify(tr.actual)}`}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          tr.passed
                            ? "bg-pass/10 text-pass"
                            : "bg-fail/10 text-fail"
                        }`}
                      >
                        {tr.passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSubmitReview}
                    disabled={isReviewing}
                    className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isReviewing ? "Reviewing..." : "Submit for Review"}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback & Next Problem Output */}
            {isReviewing && (
              <div className="py-4 flex items-center gap-3 text-text-dim font-mono text-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-1" />
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot animate-pulse-dot-delay-2" />
                <span>reviewing your code…</span>
              </div>
            )}

            {feedback && (
              <div className="space-y-4 pt-3 border-t border-line">
                <div className="p-4 bg-panel-2 border border-line rounded space-y-2 text-xs font-mono">
                  <span className="text-accent font-bold uppercase text-[11px] block">
                    Review
                  </span>
                  <div className="text-text leading-relaxed whitespace-pre-line">
                    {feedback}
                  </div>
                </div>

                <button
                  onClick={() => fetchNewProblem()}
                  className="min-h-[38px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
                >
                  Next Problem
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
