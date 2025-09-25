import mongoose from "mongoose";

const todoItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 200
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedTime: {
    type: Number,
    min: 5,
    max: 480,
    default: 30
  }, // in minutes
  actualTime: {
    type: Number,
    min: 0,
    default: 0
  }, // in minutes
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

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
  }, // in minutes
  todos: [todoItemSchema],
  completedTodos: {
    type: Number,
    default: 0
  },
  totalTodos: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
dailyGoalSchema.index({ user: 1 });
dailyGoalSchema.index({ 'todos.id': 1 });

export default mongoose.model("DailyGoal", dailyGoalSchema);