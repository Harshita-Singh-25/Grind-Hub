import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['algorithms', 'data-structures', 'system-design', 'frontend', 'backend'],
    required: true
  },
  tags: [String],
  companies: [String],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  solution: {
    approach: String,
    code: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);