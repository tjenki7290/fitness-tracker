import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWorkout = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [muscleGroupsCSV, setMuscleGroupsCSV] = useState(''); // comma-separated input
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', notes: '' }
  ]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fitness goal options
  const fitnessGoalOptions = [
    { value: 'build muscle', label: 'Build Muscle' },
    { value: 'lose weight', label: 'Lose Weight' },
    { value: 'athletic performance', label: 'Athletic Performance' },
    { value: 'general fitness', label: 'General Fitness' }
  ];

  // Convert comma-separated muscle groups to array
  const muscleGroups = muscleGroupsCSV
    .split(',')
    .map(group => group.trim())
    .filter(group => group.length > 0);

  // Exercise management functions
  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: '', reps: '', weight: '', notes: '' }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index, field, value) => {
    setExercises(prev => 
      prev.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setError('Workout title is required');
      return false;
    }
    
    if (!fitnessGoal) {
      setError('Please select a fitness goal');
      return false;
    }
    
    if (muscleGroups.length === 0) {
      setError('Please enter at least one muscle group');
      return false;
    }
    
    const validExercises = exercises.filter(ex => ex.name.trim() && ex.sets && ex.reps);
    if (validExercises.length === 0) {
      setError('Please add at least one exercise with name, sets, and reps');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare exercises data
      const exercisesData = exercises
        .filter(ex => ex.name.trim() && ex.sets && ex.reps)
        .map(ex => ({
          name: ex.name.trim(),
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps),
          weight: ex.weight ? parseInt(ex.weight) : undefined,
          notes: ex.notes.trim() || undefined
        }));

      const workoutData = {
        title: title.trim(),
        fitnessGoal,
        muscleGroups,
        exercises: exercisesData
      };

      const response = await fetch('http://localhost:5001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workout');
      }

      const createdWorkout = await response.json();
      
      // Navigate back to dashboard after successful creation
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-indigo-900">Create New Workout</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-700 hover:underline flex items-center gap-2"
            >
              Dashboard
            </button>
          </div>
          <p className="mt-2 text-indigo-700">Design your perfect workout routine</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Workout Title */}
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-2">
                  Workout Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-indigo-200 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Push Day A, Leg Day, Upper Body"
                  required
                />
              </div>

            </div>

            {/* Muscle Groups */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-indigo-900 mb-2">
                Muscle Groups * (comma-separated)
              </label>
              <input
                type="text"
                value={muscleGroupsCSV}
                onChange={(e) => setMuscleGroupsCSV(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., chest, triceps, shoulders"
                required
              />
              {muscleGroups.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {muscleGroups.map((group, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-indigo-900">Exercises</h2>
              <button
                type="button"
                onClick={addExercise}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <span>+</span>
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-indigo-900">
                      Exercise {index + 1}
                    </h3>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Exercise Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Exercise Name *
                      </label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Bench Press"
                        required
                      />
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Sets *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                        className="w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="3"
                        required
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Reps *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        className="w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="10"
                        required
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        className="w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="135"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-indigo-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={exercise.notes}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      className="w-full rounded-md border border-indigo-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Any additional notes or instructions..."
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create Workout'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkout;
