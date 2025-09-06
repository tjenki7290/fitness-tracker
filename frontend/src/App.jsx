import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreateWorkout from './pages/CreateWorkout';
import CreateAI from './pages/createAI';
import CreatePlan from './pages/CreatePlan';
import Survey from './pages/Survey';
import EditWorkout from './pages/EditWorkout';
import WorkoutDetail from './pages/WorkoutDetail';

const App = () => {
  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-workout" element={<CreateWorkout />} />
        <Route path="/create-ai" element={<CreateAI />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        <Route path="/survey" element={<Survey />} />


        /* ✅ Workout routes */
        <Route path="/workout/:id" element={<WorkoutDetail />} />
        <Route path="/workout/:id/edit" element={<EditWorkout />} />

      </Routes>
    </div>
  );
};

export default App;
