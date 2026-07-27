export interface Belt {
  name: string;
  threshold: number;
  difficulty: "easy" | "medium" | "hard";
  color: string;
}

export const BELTS: Belt[] = [
  { name: "White Belt",  threshold: 0,  difficulty: "easy",   color: "var(--white-belt)" },
  { name: "Yellow Belt", threshold: 4,  difficulty: "easy",   color: "var(--yellow-belt)" },
  { name: "Orange Belt", threshold: 9,  difficulty: "easy",   color: "var(--orange-belt)" },
  { name: "Green Belt",  threshold: 15, difficulty: "medium", color: "var(--green-belt)" },
  { name: "Blue Belt",   threshold: 22, difficulty: "medium", color: "var(--blue-belt)" },
  { name: "Brown Belt",  threshold: 32, difficulty: "hard",   color: "var(--brown-belt)" },
  { name: "Black Belt",  threshold: 45, difficulty: "hard",   color: "var(--black-belt)" },
];

export interface LogEntry {
  title: string;
  concept: string;
  difficulty: "easy" | "medium" | "hard";
  feedback: string;
  passed: boolean;
  date: string;
  code?: string;
}

export interface ProgressState {
  solved: number;
  weakAreas: string[];
  history: string[];
  log: LogEntry[];
}

export interface Task {
  text: string;
  daily: boolean;
  done: boolean;
}

/* ================= SHOPIFY CURRICULUM ================= */
export interface ShopifyModule {
  id: string;
  title: string;
  focus: string;
}

export const SHOPIFY_MODULES: ShopifyModule[] = [
  { id: "liquid-fundamentals",   title: "Liquid Fundamentals",             focus: "variables, objects, filters, tags, loops, conditionals in Liquid" },
  { id: "theme-architecture",    title: "Theme Architecture",              focus: "sections, blocks, schema.json, snippets, layout/theme.liquid structure" },
  { id: "cli-workflow",          title: "Shopify CLI & Dev Workflow",      focus: "theme pull/dev/push, dev stores, git workflow for theme code" },
  { id: "storefront-custom",     title: "Storefront Customization",        focus: "theme editor settings, metafields, dynamic sections, responsive theme customization" },
  { id: "admin-storefront-api",  title: "Shopify APIs",                    focus: "Admin API vs Storefront API, REST/GraphQL basics, auth scopes, common resources (products, orders, customers)" },
  { id: "app-dev",               title: "App Development",                 focus: "OAuth flow, embedded apps, Polaris/React, webhooks, Node/Python backend basics for a Shopify app" },
  { id: "client-handoff",        title: "Deployment & Client Handoff",     focus: "theme deployment, staging vs live, client training, documentation, handoff checklist" },
];

export interface ShopifyLogEntry {
  moduleId: string;
  moduleTitle: string;
  task: string;
  feedback: string;
  mastered: boolean;
  date: string;
  answer?: string;
}

export interface ShopifyProgressState {
  currentModuleIndex: number;
  masteredModuleIds: string[];
  log: ShopifyLogEntry[];
}

/* ================= COURSES TRACKER ================= */
export interface Course {
  id: string;
  title: string;
  platform?: string;
  totalLessons: number;
  completedLessons: number;
  url?: string;
}

/* ================= HELPERS ================= */

export function getBeltIndex(solved: number): number {
  let idx = 0;
  for (let i = 0; i < BELTS.length; i++) {
    if (solved >= BELTS[i].threshold) {
      idx = i;
    }
  }
  return idx;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { solved: 0, weakAreas: [], history: [], log: [] };
  }
  try {
    const raw = localStorage.getItem("arena:progress");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        solved: parsed.solved || 0,
        weakAreas: Array.isArray(parsed.weakAreas) ? parsed.weakAreas : [],
        history: Array.isArray(parsed.history) ? parsed.history : [],
        log: Array.isArray(parsed.log) ? parsed.log : [],
      };
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return { solved: 0, weakAreas: [], history: [], log: [] };
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("arena:progress", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  let tasks: Task[] = [];
  try {
    const raw = localStorage.getItem("checklist:tasks");
    if (raw) {
      tasks = JSON.parse(raw);
    }
  } catch (e) {
    tasks = [];
  }

  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("checklist:lastReset");
  if (lastReset !== today) {
    let modified = false;
    tasks.forEach((t) => {
      if (t.daily && t.done) {
        t.done = false;
        modified = true;
      }
    });
    localStorage.setItem("checklist:lastReset", today);
    if (modified) {
      saveTasks(tasks);
    }
  }

  return tasks;
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("checklist:tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}

export function loadShopifyProgress(): ShopifyProgressState {
  if (typeof window === "undefined") {
    return { currentModuleIndex: 0, masteredModuleIds: [], log: [] };
  }
  try {
    const raw = localStorage.getItem("shopify:progress");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentModuleIndex: typeof parsed.currentModuleIndex === "number" ? parsed.currentModuleIndex : 0,
        masteredModuleIds: Array.isArray(parsed.masteredModuleIds) ? parsed.masteredModuleIds : [],
        log: Array.isArray(parsed.log) ? parsed.log : [],
      };
    }
  } catch (e) {
    console.error("Failed to load shopify progress:", e);
  }
  return { currentModuleIndex: 0, masteredModuleIds: [], log: [] };
}

export function saveShopifyProgress(state: ShopifyProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("shopify:progress", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save shopify progress:", e);
  }
}

export function loadCourses(): Course[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("courses:list");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load courses:", e);
  }
  return [];
}

export function saveCourses(courses: Course[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("courses:list", JSON.stringify(courses));
  } catch (e) {
    console.error("Failed to save courses:", e);
  }
}

export async function callClaudeApi(systemPrompt: string, userPrompt: string) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: systemPrompt, prompt: userPrompt }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  const contentBlocks = data.content || [];
  const text = contentBlocks.map((b: any) => b.text || "").join("\n");
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}
