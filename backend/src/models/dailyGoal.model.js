import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  problem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Problem' 
  },
  type: {
    type: String,
    enum: ['problem-solving', 'study', 'mock-interview', 'peer-session'],
    required: true
  },
  duration: { 
    type: Number, 
    required: true,
    min: 0
  }, // in minutes
  completed: { 
    type: Boolean, 
    default: false 
  },
  notes: {
    type: String,
    maxLength: 500
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  topics: [String],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
studySessionSchema.index({ user: 1, createdAt: -1 });
studySessionSchema.index({ user: 1, completed: 1 });
studySessionSchema.index({ user: 1, type: 1 });

export default mongoose.model("StudySession", studySessionSchema);