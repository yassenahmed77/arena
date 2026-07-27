"use client";

import React, { useState, useEffect } from "react";
import { Course, loadCourses, saveCourses } from "@/lib/storage";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [unitType, setUnitType] = useState<"lessons" | "hours">("lessons");
  const [totalValue, setTotalValue] = useState<number | "">(10);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setCourses(loadCourses());
  }, []);

  const handleAddCourse = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const num = typeof totalValue === "number" && totalValue > 0 ? totalValue : 10;

    const newCourse: Course = {
      id: Date.now().toString(),
      title: trimmedTitle,
      platform: platform.trim() || undefined,
      unitType: unitType,
      totalLessons: num,
      completedLessons: 0,
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveCourses(updated);

    setTitle("");
    setPlatform("");
    setTotalValue(10);
  };

  const handleUpdateCompleted = (id: string, delta: number) => {
    const updated = courses.map((c) => {
      if (c.id === id) {
        const nextCompleted = Math.max(0, Math.min(c.totalLessons, Number((c.completedLessons + delta).toFixed(1))));
        return { ...c, completedLessons: nextCompleted };
      }
      return c;
    });
    setCourses(updated);
    saveCourses(updated);
  };

  const handleDirectCompletedChange = (id: string, value: number) => {
    const updated = courses.map((c) => {
      if (c.id === id) {
        const validValue = Math.max(0, Math.min(c.totalLessons, isNaN(value) ? 0 : value));
        return { ...c, completedLessons: validValue };
      }
      return c;
    });
    setCourses(updated);
    saveCourses(updated);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    saveCourses(updated);
  };

  // Drag and Drop reorder handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...courses];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, removed);

    setCourses(updated);
    saveCourses(updated);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveCourse = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    const updated = [...courses];
    const [removed] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, removed);

    setCourses(updated);
    saveCourses(updated);
  };

  // Overall progress calculations
  const totalUnitsAll = courses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedUnitsAll = courses.reduce((sum, c) => sum + c.completedLessons, 0);
  const overallPercentage = totalUnitsAll > 0 ? Math.round((completedUnitsAll / totalUnitsAll) * 100) : 0;

  return (
    <div className="space-y-6 w-full">
      {/* Overall Progress Banner */}
      <div className="bg-panel border border-line rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-text">
              Courses Dashboard
            </h2>
            <p className="text-xs font-mono text-text-dim mt-0.5">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"} · Total Progress ({overallPercentage}%)
            </p>
          </div>
          <span className="text-sm font-mono font-bold text-accent bg-accent/10 px-3 py-1 rounded border border-accent/30">
            {overallPercentage}%
          </span>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-panel-2 h-2.5 rounded-full overflow-hidden border border-line">
          <div
            className="h-full bg-gradient-to-r from-accent to-[var(--yellow-belt)] transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Add Course Card */}
      <div className="bg-panel border border-line rounded-lg p-5">
        <h3 className="font-heading font-bold text-base text-text pb-3 border-b border-line mb-4">
          Add New Course
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            placeholder="Course Title (e.g. Next.js Masterclass)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sm:col-span-4 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <input
            type="text"
            placeholder="Platform (YouTube, Udemy)..."
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="sm:col-span-3 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value as "lessons" | "hours")}
            className="sm:col-span-2 min-h-[40px] bg-bg border border-line rounded px-2 py-2 text-xs text-text focus:outline-none focus:border-accent font-mono cursor-pointer"
          >
            <option value="lessons">Lessons</option>
            <option value="hours">Hours (Duration)</option>
          </select>
          <input
            type="number"
            min={0.5}
            step={unitType === "hours" ? 0.5 : 1}
            placeholder={unitType === "hours" ? "Total Hours..." : "Total Lessons..."}
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value === "" ? "" : Number(e.target.value))}
            className="sm:col-span-2 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <button
            onClick={handleAddCourse}
            className="sm:col-span-1 min-h-[40px] bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>

      {/* Courses List with Drag & Drop Reordering */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="bg-panel border border-line rounded-lg py-12 text-center text-text-dim text-sm font-mono italic">
            مفيش كورسات مضافة لسه. ضيف كورس جديد من فوق.
          </div>
        ) : (
          courses.map((course, index) => {
            const isHours = course.unitType === "hours";
            const unitLabel = isHours ? "Hours" : "Lessons";
            const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
            const isCompleted = course.completedLessons >= course.totalLessons;
            const stepDelta = isHours ? 0.5 : 1;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={course.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-panel border rounded-lg p-5 space-y-4 transition-all ${
                  isCompleted ? "border-pass/40" : "border-line"
                } ${isDragging ? "opacity-40 scale-[0.99] border-dashed border-accent" : ""} ${
                  isDragOver ? "border-accent bg-panel-2/80" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Handle Icon */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-text-dim hover:text-accent select-none text-base px-1 py-0.5"
                      title="Drag to reorder"
                    >
                      ⠿
                    </div>

                    {/* Up / Down Quick Arrow Controls */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveCourse(index, -1)}
                        disabled={index === 0}
                        className="text-[10px] text-text-dim hover:text-accent disabled:opacity-20 leading-none px-0.5"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveCourse(index, 1)}
                        disabled={index === courses.length - 1}
                        className="text-[10px] text-text-dim hover:text-accent disabled:opacity-20 leading-none px-0.5"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <h4 className="font-heading font-bold text-base text-text truncate">
                      {course.title}
                    </h4>
                    {course.platform && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-line bg-panel-2 text-text-dim flex-shrink-0">
                        {course.platform}
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-line bg-bg text-text-dim flex-shrink-0">
                      {unitLabel}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-pass/10 text-pass border border-pass/30 flex-shrink-0">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-text-dim hover:text-fail px-2 py-1 text-xs font-mono transition-colors"
                    title="Delete Course"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar & Ratio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-text-dim">
                    <span>
                      {course.completedLessons} / {course.totalLessons} {unitLabel}
                    </span>
                    <span className="font-bold text-text">{pct}%</span>
                  </div>

                  <div className="w-full bg-panel-2 h-2 rounded-full overflow-hidden border border-line">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-pass"
                          : "bg-gradient-to-r from-accent to-[var(--yellow-belt)]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-line/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateCompleted(course.id, -stepDelta)}
                      disabled={course.completedLessons <= 0}
                      className="min-w-[32px] h-8 px-2 flex items-center justify-center bg-panel-2 border border-line text-text text-xs font-bold rounded hover:border-accent disabled:opacity-40 transition-colors"
                    >
                      -{stepDelta}
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={course.totalLessons}
                      step={stepDelta}
                      value={course.completedLessons}
                      onChange={(e) => handleDirectCompletedChange(course.id, parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-center bg-bg border border-line rounded text-xs text-text font-mono focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleUpdateCompleted(course.id, stepDelta)}
                      disabled={course.completedLessons >= course.totalLessons}
                      className="min-w-[32px] h-8 px-2 flex items-center justify-center bg-panel-2 border border-line text-text text-xs font-bold rounded hover:border-accent disabled:opacity-40 transition-colors"
                    >
                      +{stepDelta}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDirectCompletedChange(course.id, course.totalLessons)}
                    disabled={isCompleted}
                    className="min-h-[32px] px-3 bg-transparent text-text-dim hover:text-text border border-line hover:border-text-dim text-xs font-mono rounded transition-colors disabled:opacity-50"
                  >
                    Mark All Done
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
