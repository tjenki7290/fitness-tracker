//The fitness goal survey that appears after registration
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GOAL_OPTIONS = [
  'build muscle',
  'lose weight',
  'athletic performance',
  'general fitness'
];

const Survey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const priorFormData = location.state?.formData;
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!priorFormData) {
      toast.error('Missing registration data. Please start again.');
      navigate('/register');
      return;
    }

    if (!selectedGoal) {
      toast.error('Please select your fitness goal');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: priorFormData.username,
          email: priorFormData.email,
          password: priorFormData.password,
          goal: selectedGoal
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast.success('Thanks! Your goal has been saved.');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register with goal error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Quick question</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-gray-800 font-medium mb-2">What is your fitness goal?</p>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((goal) => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="goal"
                    value={goal}
                    checked={selectedGoal === goal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="capitalize">{goal}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;