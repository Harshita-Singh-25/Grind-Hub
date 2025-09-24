import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['algorithms', 'system-design', 'frontend', 'backend', 'general', 'mock-interviews'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  isPrivate: { type: Boolean, default: false },
  maxMembers: { type: Number, default: 50 },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);