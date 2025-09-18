import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: { type: String, default: "" },
  
  // New fields for interview prep platform
  role: { 
    type: String, 
    enum: ['student', 'mentor', 'admin'], 
    default: 'student' 
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced'],
    default: 'beginner'
  },
  techStack: [{
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'react', 'node', 'system-design', 'algorithms']
  }],
  currentLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  streak: { type: Number, default: 0 },
  totalProblems: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  joinedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);