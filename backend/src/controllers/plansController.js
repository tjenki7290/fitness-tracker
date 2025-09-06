import Plan from "../models/plan.js";

export async function getAllPlans(req, res) {
  try {
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const plans = await Plan.find({ userId }).populate('workouts').sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error in getAllPlans controller", error);
    res.status(500).json({ message: "Error fetching plans", error: error.message });
  }
}

export async function getPlanById(req, res) {
  try {
    const planId = req.params.id;
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const plan = await Plan.findOne({ _id: planId, userId }).populate('workouts');

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error in getPlanById controller", error);
    res.status(500).json({ message: "Error fetching plan", error: error.message });
  }
}

export async function createPlan(req, res) {
  try {
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const { title, duration, workoutsPerWeek, equipmentAccess, fitnessGoal, notes } = req.body;

    // Basic validation
    if (!title || !duration || !workoutsPerWeek || !equipmentAccess || !fitnessGoal) {
      return res.status(400).json({ message: "Missing required plan fields." });
    }

    const newPlan = new Plan({
      userId,
      title,
      duration,
      workoutsPerWeek,
      equipmentAccess,
      fitnessGoal,
      notes,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    console.error("Error in createPlan controller", error);
    res.status(500).json({ message: "Error creating plan", error: error.message });
  }
}

export async function updatePlan(req, res) {
  try {
    const planId = req.params.id;
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: planId, userId },
      { $set: updateFields },
      { new: true }
    ).populate('workouts');

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error in updatePlan controller", error);
    res.status(500).json({ message: "Error updating plan", error: error.message });
  }
}

export async function deletePlan(req, res) {
  try {
    const planId = req.params.id;
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const deletedPlan = await Plan.findOneAndDelete({ _id: planId, userId });

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json({ message: "Plan deleted successfully!" });
  } catch (error) {
    console.error("Error in deletePlan controller", error);
    res.status(500).json({ message: "Error deleting plan", error: error.message });
  }
}

export async function addWorkoutToPlan(req, res) {
  try {
    const planId = req.params.id;
    const userId = req.user?.userId || "6657e2b2c2e4b2a1b8e4d123"; // Hardcoded for testing
    const { workoutId } = req.body;

    if (!workoutId) {
      return res.status(400).json({ message: "Workout ID is required." });
    }

    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: planId, userId },
      { $addToSet: { workouts: workoutId } },
      { new: true }
    ).populate('workouts');

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error in addWorkoutToPlan controller", error);
    res.status(500).json({ message: "Error adding workout to plan", error: error.message });
  }
}

export async function removeWorkoutFromPlan(req, res) {
  try {
    const planId = req.params.id;
    const userId = req.user._id;
    const { workoutId } = req.body;

    if (!workoutId) {
      return res.status(400).json({ message: "Workout ID is required." });
    }

    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: planId, userId },
      { $pull: { workouts: workoutId } },
      { new: true }
    ).populate('workouts');

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error in removeWorkoutFromPlan controller", error);
    res.status(500).json({ message: "Error removing workout from plan", error: error.message });
  }
} 