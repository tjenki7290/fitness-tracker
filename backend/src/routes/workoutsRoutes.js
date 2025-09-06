import express from "express";
import { getAllWorkouts, createWorkout, updateWorkout, deleteWorkout, getWorkoutById, generateAIWorkout } from "../controllers/workoutsController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();


router.get("/", authenticateToken, getAllWorkouts);
router.post("/", authenticateToken, createWorkout);
router.post("/ai", authenticateToken, generateAIWorkout);
router.get("/:id", authenticateToken, getWorkoutById);
router.put("/:id", authenticateToken, updateWorkout);
router.delete("/:id", authenticateToken, deleteWorkout);

export default router;

