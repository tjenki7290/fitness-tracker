import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // --- Fetch logic (same behavior you had) ---
  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setErr("");

      try {
        const res = await fetch("http://localhost:5001/api/workouts", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.message || "Failed to fetch workouts");
        }

        const data = await res.json(); // backend returns an array
        setWorkouts(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [navigate]);

  // --- Helpers ---
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // simple primary line under title: first exercise name or goal
  const primaryLine = (w) => {
    if (w?.exercises?.length && w.exercises[0]?.name) return w.exercises[0].name;
    if (w?.muscleGroups?.length) return w.muscleGroups.join(", ");
    if (w?.fitnessGoal) return w.fitnessGoal;
    return "";
  };

  // --- Actions (wire up later if you want) ---
  const handleNew = () => navigate("/create-workout");
  const handleEdit = (id) => navigate(`/workout/${id}`); // adjust path if needed
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this workout?");
    if (!ok) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/workouts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Failed to delete");
      }
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  // --- Styles shared with empty and filled states ---
  const PageShell = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Your Workouts</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/create-ai')}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white bg-green-600 hover:bg-green-700 shadow-sm transition"
            >
              <span className="text-lg">🤖</span>
              <span className="font-medium">AI Workout</span>
            </button>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
            >
              <span className="text-lg">＋</span>
              <span className="font-medium">New Workout</span>
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageShell>
        <div className="text-gray-600">Loading your workouts…</div>
      </PageShell>
    );
  }

  if (err) {
    return (
      <PageShell>
        <div className="text-red-600">Error: {err}</div>
      </PageShell>
    );
  }

  // --- Empty state: same page layout, big centered CTA ---
  if (!workouts.length) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <p className="text-indigo-900 text-2xl font-semibold mb-3">
              No workouts yet
            </p>
            <p className="text-indigo-700/80 mb-6">
              Create your first one to get started!
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition text-lg"
            >
              <span className="text-2xl leading-none">＋</span>
              <span className="font-semibold">Create your first workout</span>
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // --- Grid of cards (like the screenshot) ---
  return (
    <PageShell>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((w) => (
          <div
            key={w._id}
            className="group relative rounded-2xl border border-indigo-500/70 bg-white shadow-[0_1px_0_rgba(99,102,241,0.3)] p-6 transition-all duration-300 hover:shadow-lg"
          >
            {/* Main content (always visible) */}
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-indigo-900">
                {w.title || "Untitled Workout"}
              </h2>
              {/* Actions */}

            </div>

            {/* Primary line (like "Bench Press") */}
            {primaryLine(w) && (
              <p className="mt-2 text-indigo-900/80">{primaryLine(w)}</p>
            )}

            {/* Date (bottom-left like the screenshot) */}
            <div className="mt-6 text-indigo-900/70 text-sm">
              {formatDate(w.createdAt)}
            </div>

            {/* Hover overlay with detailed content */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border border-indigo-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="p-6 h-full overflow-y-auto">
                {/* Header in overlay */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-900">
                    {w.title || "Untitled Workout"}
                  </h3>
                  <div className="text-indigo-600 text-sm">
                    {formatDate(w.createdAt)}
                  </div>
                </div>

                {/* Fitness Goal */}
                {w.fitnessGoal && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-indigo-800 mb-1">Fitness Goal</h4>
                    <p className="text-sm text-indigo-700">{w.fitnessGoal}</p>
                  </div>
                )}

                {/* Muscle Groups */}
                {w.muscleGroups && w.muscleGroups.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-indigo-800 mb-1">Muscle Groups</h4>
                    <div className="flex flex-wrap gap-1">
                      {w.muscleGroups.map((group, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercises */}
                {w.exercises && w.exercises.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-indigo-800 mb-2">Exercises</h4>
                    <div className="space-y-2">
                      {w.exercises.map((exercise, idx) => (
                        <div key={idx} className="bg-indigo-50 rounded-lg p-3">
                          <div className="font-medium text-sm text-indigo-900 mb-1">
                            {exercise.name}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-indigo-700">
                            {exercise.sets && (
                              <span><strong>Sets:</strong> {exercise.sets}</span>
                            )}
                            {exercise.reps && (
                              <span><strong>Reps:</strong> {exercise.reps}</span>
                            )}
                            {exercise.duration && (
                              <span><strong>Duration:</strong> {exercise.duration}s</span>
                            )}
                          </div>
                          {exercise.notes && (
                            <div className="mt-2 text-xs text-indigo-600 italic">
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons in overlay */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-indigo-200">
                  <button
                    onClick={() => handleEdit(w._id)}
                    className="flex-1 bg-indigo-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
};

export default Dashboard;
