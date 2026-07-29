"use client";

import React, { useState, useEffect } from "react";
import { Course, loadCourses, saveCourses } from "@/lib/storage";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [unitType, setUnitType] = useState<"lessons" | "hours">("lessons");
  const [totalValue, setTotalValue] = useState<number | "">(10);

  // Edit course state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPlatform, setEditPlatform] = useState("");
  const [editUnitType, setEditUnitType] = useState<"lessons" | "hours">("lessons");
  const [editTotalValue, setEditTotalValue] = useState<number | "">(10);

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

  const handleStartEdit = (course: Course) => {
    setEditingId(course.id);
    setEditTitle(course.title);
    setEditPlatform(course.platform || "");
    setEditUnitType(course.unitType || "lessons");
    setEditTotalValue(course.totalLessons);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) return;
    const newTotal = typeof editTotalValue === "number" && editTotalValue > 0 ? editTotalValue : 1;

    const updated = courses.map((c) => {
      if (c.id === editingId) {
        const clampedCompleted = Math.min(c.completedLessons, newTotal);
        return {
          ...c,
          title: trimmedTitle,
          platform: editPlatform.trim() || undefined,
          unitType: editUnitType,
          totalLessons: newTotal,
          completedLessons: clampedCompleted,
        };
      }
      return c;
    });

    setCourses(updated);
    saveCourses(updated);
    setEditingId(null);
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
    if (editingId === id) setEditingId(null);
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

  const moveCourse = (fromOrigIndex: number, toOrigIndex: number) => {
    if (toOrigIndex < 0 || toOrigIndex >= courses.length) return;

    const updated = [...courses];
    const [removed] = updated.splice(fromOrigIndex, 1);
    updated.splice(toOrigIndex, 0, removed);

    setCourses(updated);
    saveCourses(updated);
  };

  // Overall progress & stats calculations
  const lessonCourses = courses.filter((c) => (c.unitType || "lessons") === "lessons");
  const hourCourses = courses.filter((c) => c.unitType === "hours");

  const totalLessonsAll = lessonCourses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessonsAll = lessonCourses.reduce((sum, c) => sum + c.completedLessons, 0);

  const totalHoursAll = Number(hourCourses.reduce((sum, c) => sum + c.totalLessons, 0).toFixed(1));
  const completedHoursAll = Number(hourCourses.reduce((sum, c) => sum + c.completedLessons, 0).toFixed(1));

  const completedCoursesCount = courses.filter((c) => c.completedLessons >= c.totalLessons).length;

  const totalUnitsAll = courses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedUnitsAll = courses.reduce((sum, c) => sum + c.completedLessons, 0);
  const overallPercentage = totalUnitsAll > 0 ? Math.round((completedUnitsAll / totalUnitsAll) * 100) : 0;

  // Sort courses so active (incomplete) ones stay at the top and completed ones go to the bottom
  const displayCourses = courses
    .map((c, origIndex) => ({ ...c, origIndex }))
    .sort((a, b) => {
      const aDone = a.completedLessons >= a.totalLessons;
      const bDone = b.completedLessons >= b.totalLessons;
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1;
    });

  return (
    <div className="space-y-6 w-full">
      {/* Overall Progress Banner & Stats Cards */}
      <div className="bg-panel border border-line rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-lg text-text">
              Courses Dashboard
            </h2>
            <p className="text-xs font-mono text-text-dim mt-0.5">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"} Total · {completedCoursesCount} Completed
            </p>
          </div>
          <span className="text-sm font-mono font-bold text-accent bg-accent/10 px-3 py-1 rounded border border-accent/30">
            {overallPercentage}% Completed
          </span>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-bg border border-line p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
              Lessons Progress
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-text">
                {completedLessonsAll} / {totalLessonsAll}
              </span>
              <span className="text-xs font-mono text-accent font-semibold">
                {totalLessonsAll > 0 ? Math.round((completedLessonsAll / totalLessonsAll) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-bg border border-line p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
              Hours Progress
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-text">
                {completedHoursAll} / {totalHoursAll} hrs
              </span>
              <span className="text-xs font-mono text-accent font-semibold">
                {totalHoursAll > 0 ? Math.round((completedHoursAll / totalHoursAll) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-bg border border-line p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
              Courses Finished
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-text">
                {completedCoursesCount} / {courses.length}
              </span>
              <span className="text-xs font-mono text-pass font-semibold">
                {courses.length > 0 ? Math.round((completedCoursesCount / courses.length) * 100) : 0}%
              </span>
            </div>
          </div>
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
        {displayCourses.length === 0 ? (
          <div className="bg-panel border border-line rounded-lg py-12 text-center text-text-dim text-sm font-mono italic">
            مفيش كورسات مضافة لسه. ضيف كورس جديد من فوق.
          </div>
        ) : (
          displayCourses.map((course, displayIndex) => {
            const isHours = course.unitType === "hours";
            const unitLabel = isHours ? "Hours" : "Lessons";
            const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
            const isCompleted = course.completedLessons >= course.totalLessons;
            const stepDelta = isHours ? 0.5 : 1;
            const isDragging = draggedIndex === course.origIndex;
            const isDragOver = dragOverIndex === course.origIndex;
            const isEditing = editingId === course.id;

            const prevOrigIndex = displayCourses[displayIndex - 1]?.origIndex;
            const nextOrigIndex = displayCourses[displayIndex + 1]?.origIndex;

            return (
              <div
                key={course.id}
                draggable={!isEditing}
                onDragStart={(e) => handleDragStart(e, course.origIndex)}
                onDragOver={(e) => handleDragOver(e, course.origIndex)}
                onDrop={(e) => handleDrop(e, course.origIndex)}
                onDragEnd={handleDragEnd}
                className={`bg-panel border rounded-lg p-5 space-y-4 transition-all ${
                  isCompleted ? "border-pass/40 bg-panel/60" : "border-line"
                } ${isDragging ? "opacity-40 scale-[0.99] border-dashed border-accent" : ""} ${
                  isDragOver ? "border-accent bg-panel-2/80" : ""
                }`}
              >
                {isEditing ? (
                  /* Edit Mode Form */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <h4 className="font-heading font-bold text-sm text-accent">
                        ✏️ Edit Course Details
                      </h4>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs text-text-dim hover:text-text font-mono"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-mono text-text-dim mb-1">
                          Course Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full min-h-[38px] bg-bg border border-line rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-accent font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono text-text-dim mb-1">
                          Platform
                        </label>
                        <input
                          type="text"
                          value={editPlatform}
                          onChange={(e) => setEditPlatform(e.target.value)}
                          placeholder="e.g. YouTube, Udemy..."
                          className="w-full min-h-[38px] bg-bg border border-line rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-accent font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-text-dim mb-1">
                          Unit Type
                        </label>
                        <select
                          value={editUnitType}
                          onChange={(e) => setEditUnitType(e.target.value as "lessons" | "hours")}
                          className="w-full min-h-[38px] bg-bg border border-line rounded px-2 py-1.5 text-xs text-text focus:outline-none focus:border-accent font-mono cursor-pointer"
                        >
                          <option value="lessons">Lessons</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono text-text-dim mb-1">
                          Total {editUnitType === "hours" ? "Hours" : "Lessons"}
                        </label>
                        <input
                          type="number"
                          min={0.5}
                          step={editUnitType === "hours" ? 0.5 : 1}
                          value={editTotalValue}
                          onChange={(e) => setEditTotalValue(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full min-h-[38px] bg-bg border border-line rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-accent font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-line/60">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-panel-2 border border-line text-text-dim hover:text-text text-xs font-mono rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1.5 bg-accent text-bg font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Course Display */
                  <>
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
                            onClick={() => prevOrigIndex !== undefined && moveCourse(course.origIndex, prevOrigIndex)}
                            disabled={displayIndex === 0}
                            className="text-[10px] text-text-dim hover:text-accent disabled:opacity-20 leading-none px-0.5"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => nextOrigIndex !== undefined && moveCourse(course.origIndex, nextOrigIndex)}
                            disabled={displayIndex === displayCourses.length - 1}
                            className="text-[10px] text-text-dim hover:text-accent disabled:opacity-20 leading-none px-0.5"
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>

                        <h4 className={`font-heading font-bold text-base text-text truncate ${isCompleted ? "line-through opacity-80" : ""}`}>
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

                      {/* Action Buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(course)}
                          className="text-text-dim hover:text-accent px-2 py-1 text-xs font-mono transition-colors"
                          title="Edit Course Details"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-text-dim hover:text-fail px-2 py-1 text-xs font-mono transition-colors"
                          title="Delete Course"
                        >
                          ✕
                        </button>
                      </div>
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
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

