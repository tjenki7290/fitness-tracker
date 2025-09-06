// src/pages/EditWorkout.jsx
// Route: /workout/:id/edit  (defined in App.jsx)
// Navigates here from Dashboard pencil: navigate(`/workout/${id}/edit`)

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditWorkout() {
  const { id } = useParams();               // <- "123" from /workout/123/edit
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [muscleGroupsCSV, setMuscleGroupsCSV] = useState(""); // comma-separated
  const [exercises, setExercises] = useState([]); // [{name, sets, reps, duration, notes}]

  // Derived
  const muscleGroups = useMemo(
    () =>
      muscleGroupsCSV
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [muscleGroupsCSV]
  );

  // Fetch the specific workout
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        setLoading(true);
        setErr("");

        const res = await fetch(`http://localhost:5001/api/workouts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return navigate("/login");
        }

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.message || "Failed to load workout");
        }

        const w = await res.json();

        // Pre-fill form
        setTitle(w.title || "");
        setFitnessGoal(w.fitnessGoal || "");
        setMuscleGroupsCSV(
          Array.isArray(w.muscleGroups) ? w.muscleGroups.join(", ") : ""
        );
        setExercises(
          Array.isArray(w.exercises)
            ? w.exercises.map((ex) => ({
                name: ex?.name || "",
                sets: ex?.sets ?? "",
                reps: ex?.reps ?? "",
                duration: ex?.duration ?? "",
                notes: ex?.notes || "",
              }))
            : []
        );
      } catch (e) {
        setErr(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // Exercise helpers
  const addExercise = () =>
    setExercises((prev) => [
      ...prev,
      { name: "", sets: "", reps: "", duration: "", notes: "" },
    ]);

  const removeExercise = (idx) =>
    setExercises((prev) => prev.filter((_, i) => i !== idx));

  const updateExercise = (idx, field, value) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex))
    );

  // Save/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErr("Title is required.");
      return;
    }

    const payload = {
      title: title.trim(),
      fitnessGoal: fitnessGoal || undefined,
      muscleGroups, // array
      exercises: exercises
        .map((ex) => ({
          name: ex.name?.trim(),
          sets: ex.sets === "" ? undefined : Number(ex.sets),
          reps: ex.reps === "" ? undefined : Number(ex.reps),
          duration: ex.duration === "" ? undefined : Number(ex.duration),
          notes: ex.notes?.trim() || undefined,
        }))
        .filter((ex) => ex.name),
    };

    try {
      setSaving(true);
      setErr("");

      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // If your backend uses POST /api/workouts/:id/edit, change method+URL accordingly.
      const res = await fetch(`http://localhost:5001/api/workouts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return navigate("/login");
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Failed to save workout");
      }

      // Success → go to detail (or back to dashboard if you prefer)
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading workout…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-900">Edit Workout</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-700 hover:underline"
          >
            ← Back
          </button>
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {err}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-2xl border border-indigo-200"
        >
          <div>
            <label className="block text-sm font-medium text-indigo-900">
              Title
            </label>
            <input
              className="mt-1 w-full rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Push Day A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-900">
              Fitness Goal
            </label>
            <input
              className="mt-1 w/full rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              placeholder="Build muscle / Lose fat / Performance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-900">
              Muscle Groups (comma-separated)
            </label>
            <input
              className="mt-1 w-full rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              value={muscleGroupsCSV}
              onChange={(e) => setMuscleGroupsCSV(e.target.value)}
              placeholder="Chest, Triceps, Shoulders"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-indigo-900">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="rounded-full bg-indigo-600 text-white px-3 py-1 text-sm hover:bg-indigo-700"
              >
                + Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={i} className="rounded-xl border border-indigo-200 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input
                      className="col-span-2 rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Name (e.g., Bench Press)"
                      value={ex.name}
                      onChange={(e) => updateExercise(i, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      className="rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) => updateExercise(i, "sets", e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      className="rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Reps"
                      value={ex.reps}
                      onChange={(e) => updateExercise(i, "reps", e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      className="rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Duration (sec)"
                      value={ex.duration}
                      onChange={(e) =>
                        updateExercise(i, "duration", e.target.value)
                      }
                    />
                  </div>
                  <textarea
                    className="mt-3 w-full rounded-md border border-indigo-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Notes"
                    rows={2}
                    value={ex.notes}
                    onChange={(e) => updateExercise(i, "notes", e.target.value)}
                  />
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeExercise(i)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {exercises.length === 0 && (
                <p className="text-sm text-indigo-900/70">
                  No exercises yet. Add one to get started.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-600 text-white px-5 py-2.5 font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/workout/${id}`)}
              className="rounded-full border border-indigo-300 px-5 py-2.5 text-indigo-700 hover:bg-indigo-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
