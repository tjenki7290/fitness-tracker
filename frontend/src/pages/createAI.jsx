import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAI = () => {
  const navigate = useNavigate();
  
  // Form state
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [duration, setDuration] = useState(45);
  const [userFitnessGoal, setUserFitnessGoal] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Equipment options
  const equipmentOptions = [
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'dumbbells', label: 'Dumbbells' },
    { value: 'barbell', label: 'Barbell' },
    { value: 'power rack', label: 'Power Rack' }
  ];

  // Muscle group options
  const muscleGroupOptions = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'biceps', label: 'Biceps' },
    { value: 'triceps', label: 'Triceps' },
    { value: 'legs', label: 'Legs' },
    { value: 'abs', label: 'Abs' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'calves', label: 'Calves' }
  ];

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 75, label: '75 minutes' },
    { value: 90, label: '90 minutes' }
  ];

  // Fetch user's fitness goal on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user data to get fitness goal
        const response = await fetch('http://localhost:5001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (response.ok) {
          const userData = await response.json();
          setUserFitnessGoal(userData.fitnessGoal || 'general fitness');
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Equipment selection handlers
  const toggleEquipment = (equipment) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment)
        ? prev.filter(item => item !== equipment)
        : [...prev, equipment]
    );
  };

  // Muscle group selection handlers
  const toggleMuscleGroup = (muscleGroup) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscleGroup)
        ? prev.filter(item => item !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  // Form validation
  const validateForm = () => {
    if (selectedEquipment.length === 0) {
      setError('Please select at least one piece of equipment');
      return false;
    }
    
    if (selectedMuscleGroups.length === 0) {
      setError('Please select at least one muscle group');
      return false;
    }
    
    if (!duration || duration < 15) {
      setError('Please select a valid workout duration');
      return false;
    }
    
    return true;
  };

  // Handle AI workout generation
  const handleGenerateWorkout = async (e) => {
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

      const requestData = {
        equipment: selectedEquipment,
        muscleGroups: selectedMuscleGroups,
        duration: duration
      };

      const response = await fetch('http://localhost:5001/api/workouts/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate workout');
      }

      const generatedWorkout = await response.json();
      
      // Navigate back to dashboard after successful generation
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message || 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-indigo-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-indigo-900">AI Workout Generator</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-700 hover:underline flex items-center gap-2"
            >
              Dashboard
            </button>
          </div>
          <p className="mt-2 text-indigo-700">
            Let AI create a personalized workout based on your preferences
          </p>
          {userFitnessGoal && (
            <p className="mt-1 text-sm text-indigo-600">
              Your fitness goal: <span className="font-medium capitalize">{userFitnessGoal.replace('_', ' ')}</span>
            </p>
          )}
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
        <form onSubmit={handleGenerateWorkout} className="space-y-8">
          {/* Equipment Selection */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Available Equipment</h2>
            <p className="text-sm text-indigo-700 mb-4">Select all equipment you have access to:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {equipmentOptions.map((equipment) => (
                <label
                  key={equipment.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedEquipment.includes(equipment.value)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-indigo-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEquipment.includes(equipment.value)}
                    onChange={() => toggleEquipment(equipment.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-indigo-900">
                    {equipment.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Muscle Groups Selection */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Target Muscle Groups</h2>
            <p className="text-sm text-indigo-700 mb-4">Select the muscle groups you want to work:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {muscleGroupOptions.map((muscleGroup) => (
                <label
                  key={muscleGroup.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedMuscleGroups.includes(muscleGroup.value)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-indigo-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMuscleGroups.includes(muscleGroup.value)}
                    onChange={() => toggleMuscleGroup(muscleGroup.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-indigo-900 capitalize">
                    {muscleGroup.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Workout Duration */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Workout Duration</h2>
            <p className="text-sm text-indigo-700 mb-4">How long do you want your workout to be?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {durationOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition ${
                    duration === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-indigo-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={duration === option.value}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-indigo-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Workout...
                </>
              ) : (
                <>
                  <span>🤖</span>
                  Generate AI Workout
                </>
              )}
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

export default CreateAI;
