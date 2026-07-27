"use client";

import React, { useState, useEffect } from "react";
import { Task, loadTasks, saveTasks } from "@/lib/storage";

export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [isDaily, setIsDaily] = useState(true);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const handleAddTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    const updated = [...tasks, { text: trimmed, daily: isDaily, done: false }];
    setTasks(updated);
    saveTasks(updated);
    setTaskText("");
  };

  const handleToggleTask = (index: number) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
    saveTasks(updated);
  };

  const handleDeleteTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    saveTasks(updated);
  };

  const handleResetChecks = () => {
    const updated = tasks.map((t) => ({ ...t, done: false }));
    setTasks(updated);
    saveTasks(updated);
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <section className="w-full">
      <div className="bg-panel border border-line rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 border-b border-line mb-5">
          <h2 className="font-heading text-lg font-bold text-text">Daily Checklist</h2>
          <span className="bg-panel-2 text-text-dim text-xs font-mono px-2.5 py-1 rounded border border-line">
            {doneCount}/{tasks.length}
          </span>
        </div>

        {/* Add task row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="add a task…"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1 min-w-[200px] min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent"
          />
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-dim px-1 min-h-[40px]">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="w-4 h-4 rounded border-line bg-bg accent-accent cursor-pointer"
            />
            daily
          </label>
          <button
            onClick={handleAddTask}
            className="min-h-[40px] px-5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2 mb-6">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-text-dim text-sm italic">
              مفيش مهام لسه. ضيف مهمة من فوق.
            </div>
          ) : (
            tasks.map((task, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-3 p-3 bg-panel-2 border border-line rounded transition-colors ${
                  task.done ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(idx)}
                    className="w-4 h-4 rounded border-line bg-bg accent-accent cursor-pointer flex-shrink-0"
                  />
                  <span
                    className={`text-sm text-text font-mono truncate ${
                      task.done ? "line-through text-text-dim" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  {task.daily && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-line bg-bg text-text-dim flex-shrink-0">
                      daily
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteTask(idx)}
                  className="text-text-dim hover:text-fail px-2 py-1 text-xs font-mono min-h-[32px] transition-colors"
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom controls */}
        <div className="pt-3 border-t border-line">
          <button
            onClick={handleResetChecks}
            className="min-h-[38px] px-4 bg-transparent text-text-dim hover:text-text border border-line hover:border-text-dim text-xs font-mono rounded transition-colors"
          >
            Reset checks
          </button>
        </div>
      </div>
    </section>
  );
}
