import Workout from "../models/workout.js";
import OpenAI from 'openai';
import mongoose from 'mongoose';

export async function getAllWorkouts(req, res) {
    try {
      const userId = req.user._id;
      const workouts = await Workout.find({ userId }).sort({ createdAt: -1});
      res.status(200).json(workouts)
    } catch (error){
      console.error("Error in getAllWorkouts controller", error);

      res.status(500).json({message: "Error fetching workouts", error:error.message})
    }
  }

  export async function getWorkoutById(req, res) {
    try {
      const workoutId = req.params.id;
      const userId = req.user._id;
      const workout = await Workout.findOne({ _id: workoutId, userId });

      if (!workout) {
        return res.status(404).json({ message: "Workout not found." });
      }

      res.status(200).json(workout);
    } catch (error) {
      console.error("Error in getWorkoutById controller", error);
      res.status(500).json({ message: "Error fetching workout", error: error.message });
    }
  } 

  export async function createWorkout(req, res) {
    try {
      const userId = req.user._id;
      const { title, muscleGroups, exercises, fitnessGoal } = req.body;

      // Basic validation (could be expanded)
      if (!title || !muscleGroups || !exercises || !fitnessGoal) {
        return res.status(400).json({ message: "Missing required workout fields." });
      }

      const newWorkout = new Workout({
        userId,
        title,
        muscleGroups,
        exercises,
        fitnessGoal,
      });

      const savedWorkout = await newWorkout.save();
      res.status(201).json(savedWorkout);
    } catch (error) {
      console.error("Error in createWorkout controller", error);
      res.status(500).json({ message: "Error creating workout", error: error.message });
    }
  }
  
  export async function updateWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const userId = req.user._id;
      const updateFields = req.body; // Accept any fields

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields provided to update." });
      }

      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: workoutId, userId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedWorkout) {
        return res.status(404).json({ message: "Workout not found." });
      }

      res.status(200).json(updatedWorkout);
    } catch (error) {
      console.error("Error in updateWorkout controller", error);
      res.status(500).json({ message: "Error updating workout", error: error.message });
    }
  }
  
  export async function deleteWorkout(req, res) {
    try {
      const workoutId = req.params.id;
      const userId = req.user._id;
      const deletedWorkout = await Workout.findOneAndDelete({ _id: workoutId, userId });

      if (!deletedWorkout) {
        return res.status(404).json({ message: "Workout not found." });
      }

      res.status(200).json({ message: "Workout deleted successfully!" });
    } catch (error) {
      console.error("Error in deleteWorkout controller", error);
      res.status(500).json({ message: "Error deleting workout", error: error.message });
    }
  }

  export async function generateAIWorkout(req, res) {
    try {
      const userId = req.user._id;
      const { equipment, muscleGroups, duration } = req.body;

      // Validation
      if (!equipment || !muscleGroups || !duration) {
        return res.status(400).json({ message: "Missing required fields: equipment, muscleGroups, duration" });
      }

      if (!Array.isArray(equipment) || equipment.length === 0) {
        return res.status(400).json({ message: "Equipment must be a non-empty array" });
      }

      if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
        return res.status(400).json({ message: "Muscle groups must be a non-empty array" });
      }

      // Get user's fitness goal from their profile
      const User = mongoose.model('User');
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const fitnessGoal = user.fitnessGoal || 'general fitness';

      // Generate AI workout (this is a mock implementation - replace with actual AI call)
      const aiWorkout = await generateWorkoutWithAI(equipment, muscleGroups, duration, fitnessGoal);

      // Save the generated workout to database
      const newWorkout = new Workout({
        userId,
        title: aiWorkout.title,
        muscleGroups: aiWorkout.muscleGroups,
        exercises: aiWorkout.exercises,
        fitnessGoal: aiWorkout.fitnessGoal,
        generatedByAI: true
      });

      const savedWorkout = await newWorkout.save();
      res.status(201).json(savedWorkout);

    } catch (error) {
      console.error("Error in generateAIWorkout controller", error);
      res.status(500).json({ message: "Error generating AI workout", error: error.message });
    }
  }

  // Real OpenAI AI function
  async function generateWorkoutWithAI(equipment, muscleGroups, duration, fitnessGoal) {
    // Move exerciseCount outside try block to avoid scope issues
    const exerciseCount = Math.max(3, Math.floor(duration / 15)); // Estimate exercises based on duration
    
    try {
      // Lazy-initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
      });
      
      const prompt = `You are a professional fitness trainer. Create a personalized workout plan and respond ONLY with valid JSON.

Requirements:
- Equipment available: ${equipment.join(', ')}
- Target muscle groups: ${muscleGroups.join(', ')}
- Workout duration: ${duration} minutes
- Fitness goal: ${fitnessGoal}
- Generate exactly ${exerciseCount} exercises

Exercise guidelines:
- Use only the available equipment
- Target the specified muscle groups
- Appropriate for the fitness goal
- Can be completed within ${duration} minutes

Respond with ONLY this JSON structure (no other text):
{
  "title": "Creative workout title",
  "fitnessGoal": "${fitnessGoal}",
  "muscleGroups": ${JSON.stringify(muscleGroups)},
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 10,
      "notes": "Brief notes"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and workout planner. You create personalized, effective workout plans based on user requirements. Always respond with valid JSON that matches the exact structure requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const responseText = completion.choices[0].message.content.trim();
      
      console.log('AI Response:', responseText); // Debug log
      
      // Try to parse the JSON response
      let workoutData;
      try {
        // Try to extract JSON from the response (in case AI adds extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        workoutData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        console.error('Parse error:', parseError.message);
        throw new Error('AI generated invalid response format');
      }

      // Validate the response structure
      if (!workoutData.title || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
        console.error('AI response missing required fields:', workoutData);
        throw new Error('AI response missing required fields');
      }

      // Ensure exercises have required fields and are within exerciseCount limit
      workoutData.exercises = workoutData.exercises
        .slice(0, exerciseCount) // Limit to exerciseCount
        .map(exercise => ({
          name: exercise.name || 'Unknown Exercise',
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          notes: exercise.notes || ''
        }));

      return {
        title: workoutData.title,
        fitnessGoal: workoutData.fitnessGoal || fitnessGoal,
        muscleGroups: workoutData.muscleGroups || muscleGroups,
        exercises: workoutData.exercises,
        generatedByAI: true
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to basic workout if AI fails
      const fallbackExercises = muscleGroups.map(muscleGroup => ({
        name: `${muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)} Exercise`,
        sets: 3,
        reps: 10,
        notes: `Targeting ${muscleGroup}`
      }));

      return {
        title: `${muscleGroups.join(', ').replace(/\b\w/g, l => l.toUpperCase())} Workout`,
        fitnessGoal: fitnessGoal,
        muscleGroups: muscleGroups,
        exercises: fallbackExercises.slice(0, exerciseCount),
        generatedByAI: true
      };
    }
  }
  