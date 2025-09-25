import mongoose from "mongoose";

const dailyGoalSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  target: { 
    type: Number, 
    required: true,
    min: 5,
    max: 480,
    default: 60
  }, // in minutes
  current: { 
    type: Number, 
    default: 0,
    min: 0
  } // in minutes
}, { 
  timestamps: true 
});

// Indexes for efficient queries
dailyGoalSchema.index({ user: 1 });

export default mongoose.model("DailyGoal", dailyGoalSchema);