import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  type: {
    type: String,
    enum: ['problem-solving', 'study', 'mock-interview', 'peer-session'],
    required: true
  },
  duration: { type: Number, required: true }, // in minutes
  completed: { type: Boolean, default: false },
  notes: String,
  difficulty: String,
  topics: [String]
}, { timestamps: true });

export default mongoose.model("studySession", studySessionSchema);