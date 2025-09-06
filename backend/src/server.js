import express from "express";
import workoutsRoutes from "./routes/workoutsRoutes.js";
import plansRoutes from "./routes/plansRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

// Debug: Check if environment variables are loaded
console.log("UPSTASH_REDIS_REST_URL:", process.env.UPSTASH_REDIS_REST_URL ? "Set" : "Not set");
console.log("UPSTASH_REDIS_REST_TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Set" : "Not set");

const app = express();
app.set('trust proxy', true); // Trust proxy for correct req.ip
const PORT = process.env.PORT || 5001

//middleware 
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Enable CORS for frontend
app.use(express.json()); //this middleware that will parse JSON bodies
app.use(rateLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/plans", plansRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB", error);
  process.exit(1);
});




