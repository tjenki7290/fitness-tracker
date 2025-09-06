// src/pages/WorkoutDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch(`http://localhost:5001/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load workout");
        setWorkout(await res.json());
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [id, navigate]);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!workout) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-700 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mt-4">{workout.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(workout.createdAt).toLocaleString()}
      </p>

      {workout.fitnessGoal && (
        <p className="mt-3">
          <strong>Goal:</strong> {workout.fitnessGoal}
        </p>
      )}

      {workout.muscleGroups?.length > 0 && (
        <p className="mt-3">
          <strong>Muscle Groups:</strong> {workout.muscleGroups.join(", ")}
        </p>
      )}

      {workout.exercises?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Exercises</h2>
          <ul className="list-disc pl-6">
            {workout.exercises.map((ex, i) => (
              <li key={i}>
                {ex.name} — {ex.sets} sets × {ex.reps} reps {ex.duration && `(${ex.duration}s)`}
                {ex.notes && ` — ${ex.notes}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate(`/workout/${id}/edit`)}
        className="mt-6 rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
      >
        Edit Workout
      </button>
    </div>
  );
}
