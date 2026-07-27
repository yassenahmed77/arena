"use client";

import React, { useState, useEffect } from "react";
import { Course, loadCourses, saveCourses } from "@/lib/storage";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [totalLessons, setTotalLessons] = useState<number | "">(10);

  useEffect(() => {
    setCourses(loadCourses());
  }, []);

  const handleAddCourse = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const lessonsNum = typeof totalLessons === "number" && totalLessons > 0 ? totalLessons : 10;

    const newCourse: Course = {
      id: Date.now().toString(),
      title: trimmedTitle,
      platform: platform.trim() || undefined,
      totalLessons: lessonsNum,
      completedLessons: 0,
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveCourses(updated);

    setTitle("");
    setPlatform("");
    setTotalLessons(10);
  };

  const handleUpdateCompleted = (id: string, delta: number) => {
    const updated = courses.map((c) => {
      if (c.id === id) {
        const nextCompleted = Math.max(0, Math.min(c.totalLessons, c.completedLessons + delta));
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

  // Overall progress calculations
  const totalLessonsAll = courses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessonsAll = courses.reduce((sum, c) => sum + c.completedLessons, 0);
  const overallPercentage = totalLessonsAll > 0 ? Math.round((completedLessonsAll / totalLessonsAll) * 100) : 0;

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
              {courses.length} {courses.length === 1 ? "Course" : "Courses"} · {completedLessonsAll} / {totalLessonsAll} Lessons Completed ({overallPercentage}%)
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
            placeholder="Course Title (e.g. React & Next.js Masterclass)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sm:col-span-5 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <input
            type="text"
            placeholder="Platform (YouTube, Udemy)..."
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="sm:col-span-3 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <input
            type="number"
            min={1}
            placeholder="Lessons count..."
            value={totalLessons}
            onChange={(e) => setTotalLessons(e.target.value === "" ? "" : Number(e.target.value))}
            className="sm:col-span-2 min-h-[40px] bg-bg border border-line rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent font-mono"
          />
          <button
            onClick={handleAddCourse}
            className="sm:col-span-2 min-h-[40px] bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="bg-panel border border-line rounded-lg py-12 text-center text-text-dim text-sm font-mono italic">
            مفيش كورسات مضافة لسه. ضيف كورس جديد من فوق.
          </div>
        ) : (
          courses.map((course) => {
            const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
            const isCompleted = course.completedLessons >= course.totalLessons;

            return (
              <div
                key={course.id}
                className={`bg-panel border border-line rounded-lg p-5 space-y-4 transition-colors ${
                  isCompleted ? "border-pass/40" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <h4 className="font-heading font-bold text-base text-text truncate">
                      {course.title}
                    </h4>
                    {course.platform && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-line bg-panel-2 text-text-dim flex-shrink-0">
                        {course.platform}
                      </span>
                    )}
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
                      {course.completedLessons} / {course.totalLessons} Lessons
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
                      onClick={() => handleUpdateCompleted(course.id, -1)}
                      disabled={course.completedLessons <= 0}
                      className="w-8 h-8 flex items-center justify-center bg-panel-2 border border-line text-text text-sm font-bold rounded hover:border-accent disabled:opacity-40 transition-colors"
                    >
                      -1
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={course.totalLessons}
                      value={course.completedLessons}
                      onChange={(e) => handleDirectCompletedChange(course.id, parseInt(e.target.value) || 0)}
                      className="w-16 h-8 text-center bg-bg border border-line rounded text-xs text-text font-mono focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleUpdateCompleted(course.id, 1)}
                      disabled={course.completedLessons >= course.totalLessons}
                      className="w-8 h-8 flex items-center justify-center bg-panel-2 border border-line text-text text-sm font-bold rounded hover:border-accent disabled:opacity-40 transition-colors"
                    >
                      +1
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
