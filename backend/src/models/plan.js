import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
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
    duration: {
      type: Number, // Duration in weeks
      required: true,
      min: 1,
      max: 52, // Maximum 1 year
    },
    workoutsPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    equipmentAccess: {
      type: String,
      required: true,
      enum: ["bodyweight", "dumbbells", "gym", "resistance_bands"],
    },

    fitnessGoal: {
      type: String,
      required: true,
      enum: ["build muscle", "lose weight", "athletic performance", "general fitness"],
    },
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Calculate end date based on duration and workouts per week
planSchema.pre("save", function (next) {
  if (this.duration && this.startDate) {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + (this.duration * 7));
    this.endDate = endDate;
  }
  next();
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan; 