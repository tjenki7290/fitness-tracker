//Page where user can create a new workout plan
//I plan on making this appear differently on the dashboard page for ex: the workouts could be a black box with a blue outline but the create plan button could be a green box with a white outline
//the AI will then generate a workout plan for the user based on the user's fitness goals and the length of the plan
//the user will be able to save the plan and view it later
//the user will be able to edit the plan later
//the user will be able to delete the plan
//the user will be able to view the plan on the dashboard
//once i get to this page, I'll need to check the backend to see if i need to create a new schema and a new controller
//parameters the user will need to input:
//-Duration of Plan
//-How many days per week I can work out (e.g. 3x/week, 5x/week)
//Equipment Access
// Bodyweight only
// Dumbbells, kettlebells, barbell
// Gym access
// Resistance bands
//AI Coaching Style(tough/motivational/encouraging)
import React from 'react';

const CreatePlan = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Plan</h1>
        <p className="text-gray-600">Plan creation coming soon!</p>
      </div>
    </div>
  );
};

export default CreatePlan;