import express from "express";
import workoutsRoutes from "./routes/workoutsRoutes.js";
import plansRoutes from "./routes/plansRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Debug: Check if environment variables are loaded
console.log("UPSTASH_REDIS_REST_URL:", process.env.UPSTASH_REDIS_REST_URL ? "Set" : "Not set");
console.log("UPSTASH_REDIS_REST_TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Set" : "Not set");

const app = express();
app.set('trust proxy', true); // Trust proxy for correct req.ip
const PORT = process.env.PORT || 5001

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log directory structure
console.log("__dirname:", __dirname);
// Calculate correct frontend path (go up from backend/src to project root, then to frontend/dist)
const frontendPath = path.join(__dirname, '../../frontend/dist');
console.log("Frontend dist path:", frontendPath);

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

// Serve static files from the React app build directory
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath);
});

// Connect to MongoDB (non-blocking in development)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB", error);
  // In development, allow server to start even if MongoDB fails
  // This allows frontend to work independently
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn("⚠️  Server starting without MongoDB connection (development mode)");
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
      console.log("⚠️  Note: MongoDB connection failed. API endpoints requiring DB will not work.");
    });
  }
});




