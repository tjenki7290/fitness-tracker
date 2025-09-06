import mongoose from "mongoose";

// 1-create a schema
// 2-create a model based off that schema

const workoutSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          muscleGroups: {
            type: [String], // e.g. ["chest", "legs", "back"]
            required: true,
          },
          exercises: [
            {
              name: { type: String, required: true },       // e.g. "Bench Press"
              sets: { type: Number, required: true },        // e.g. 4
              reps: { type: Number, required: true },        // e.g. 10
              weight: { type: Number },                      // optional weight in lbs/kg
              notes: { type: String },                       // optional user notes
            },
          ],
          fitnessGoal: {
            type: String,
            required: true,
            enum: ["build muscle", "lose weight", "athletic performance", "general fitness"], // update as needed 
          },
          generatedByAI: {
            type: Boolean,
            default: false,
          },
        },
        {
          timestamps: true, // adds createdAt and updatedAt automatically
}
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;