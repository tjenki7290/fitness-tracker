import express from "express";
import { 
  getAllPlans, 
  getPlanById, 
  createPlan, 
  updatePlan, 
  deletePlan,
  addWorkoutToPlan,
  removeWorkoutFromPlan
} from "../controllers/plansController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Basic CRUD operations
router.get("/", authenticateToken, getAllPlans);
router.get("/:id", authenticateToken, getPlanById);
router.post("/", authenticateToken, createPlan);
router.put("/:id", authenticateToken, updatePlan);
router.delete("/:id", authenticateToken, deletePlan);

// Workout management within plans
router.post("/:id/workouts", authenticateToken, addWorkoutToPlan);
router.delete("/:id/workouts", authenticateToken, removeWorkoutFromPlan);

export default router; 