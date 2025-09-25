import StudySession from "../models/studySession.model.js";
import User from "../models/user.model.js";
import DailyGoal from "../models/dailyGoal.model.js";

export const startStudySession = async (req, res) => {
  try {
    const { type, problem, notes } = req.body;
    
    // Validate session type
    const validTypes = ['problem-solving', 'study', 'mock-interview', 'peer-session'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid session type" });
    }
    
    const session = new StudySession({
      user: req.user._id,
      type,
      problem: problem || undefined,
      notes,
      duration: 0,
      startTime: new Date()
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.log("Error in startStudySession controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const endStudySession = async (req, res) => {
  try {
    const { sessionId, duration, notes, completed } = req.body;
    
    if (!sessionId || duration === undefined) {
      return res.status(400).json({ error: "Session ID and duration are required" });
    }

    const session = await StudySession.findOneAndUpdate(
      { _id: sessionId, user: req.user._id },
      {
        duration: Math.max(0, Math.floor(duration)), // Ensure positive integer
        notes,
        completed: completed || false,
        endTime: new Date()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update user stats if session was completed
    if (completed && duration > 0) {
      const updateFields = {
        lastActive: new Date()
      };
      
      if (session.type === 'problem-solving') {
        updateFields.$inc = { totalProblems: 1 };
      }
      
      await User.findByIdAndUpdate(req.user._id, updateFields);
    }

    res.status(200).json(session);
  } catch (error) {
    console.log("Error in endStudySession controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's sessions
    const todaySessions = await StudySession.find({
      user: userId,
      createdAt: { $gte: today, $lt: tomorrow },
      completed: true
    });

    const todayMinutes = todaySessions.reduce((total, session) => total + session.duration, 0);
    const todayHours = Math.round((todayMinutes / 60) * 100) / 100;

    // Get user data
    const user = await User.findById(userId);

    // Calculate streak
    const streak = await calculateStreak(userId);

    // Get total study rooms joined (you can implement this based on your room model)
    const totalRooms = 0; // Placeholder - implement based on your room joining logic

    const stats = {
      streak,
      totalProblems: user.totalProblems || 0,
      todayHours,
      currentLevel: determineLevelFromProblems(user.totalProblems || 0),
      totalRooms,
      weeklyProgress: await getWeeklyProgress(userId)
    };

    res.status(200).json(stats);
  } catch (error) {
    console.log("Error in getStudyStats controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    
    const sessions = await StudySession.find({ user: userId, completed: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('problem', 'title difficulty');

    const totalSessions = await StudySession.countDocuments({ user: userId, completed: true });
    const totalMinutes = await StudySession.aggregate([
      { $match: { user: userId, completed: true } },
      { $group: { _id: null, total: { $sum: "$duration" } } }
    ]);

    res.status(200).json({
      sessions,
      totalSessions,
      totalMinutes: totalMinutes[0]?.total || 0,
      currentPage: page,
      totalPages: Math.ceil(totalSessions / limit)
    });
  } catch (error) {
    console.log("Error in getStudyHistory controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getDailyGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    let goal = await DailyGoal.findOne({ user: userId });
    
    if (!goal) {
      goal = new DailyGoal({
        user: userId,
        target: 60, // Default 60 minutes
        current: 0,
        todos: [],
        completedTodos: 0,
        totalTodos: 0
      });
      await goal.save();
    }

    // Update current progress for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await StudySession.find({
      user: userId,
      createdAt: { $gte: today, $lt: tomorrow },
      completed: true
    });

    const current = todaySessions.reduce((total, session) => total + session.duration, 0);
    goal.current = current;

    // Update todo statistics
    goal.completedTodos = goal.todos.filter(todo => todo.completed).length;
    goal.totalTodos = goal.todos.length;

    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    console.log("Error in getDailyGoal controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDailyGoal = async (req, res) => {
  try {
    const { target } = req.body;
    const userId = req.user._id;

    if (!target || target < 5 || target > 480) {
      return res.status(400).json({ error: "Target must be between 5 and 480 minutes" });
    }

    let goal = await DailyGoal.findOneAndUpdate(
      { user: userId },
      { target: Math.floor(target) },
      { new: true, upsert: true }
    );

    res.status(200).json(goal);
  } catch (error) {
    console.log("Error in updateDailyGoal controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add new todo item
export const addTodo = async (req, res) => {
  try {
    const { text, priority = 'medium', estimatedTime = 30 } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Todo text is required" });
    }

    if (text.length > 200) {
      return res.status(400).json({ error: "Todo text must be less than 200 characters" });
    }

    const todoId = new Date().getTime().toString();
    const newTodo = {
      id: todoId,
      text: text.trim(),
      priority,
      estimatedTime: Math.max(5, Math.min(480, estimatedTime)),
      completed: false,
      actualTime: 0,
      createdAt: new Date()
    };

    const goal = await DailyGoal.findOneAndUpdate(
      { user: userId },
      { 
        $push: { todos: newTodo },
        $inc: { totalTodos: 1 }
      },
      { new: true, upsert: true }
    );

    res.status(201).json(goal);
  } catch (error) {
    console.log("Error in addTodo controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update todo item
export const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { text, priority, estimatedTime, completed, actualTime } = req.body;
    const userId = req.user._id;

    const updateFields = {};
    if (text !== undefined) updateFields['todos.$.text'] = text.trim();
    if (priority !== undefined) updateFields['todos.$.priority'] = priority;
    if (estimatedTime !== undefined) updateFields['todos.$.estimatedTime'] = Math.max(5, Math.min(480, estimatedTime));
    if (actualTime !== undefined) updateFields['todos.$.actualTime'] = Math.max(0, actualTime);
    
    if (completed !== undefined) {
      updateFields['todos.$.completed'] = completed;
      if (completed) {
        updateFields['todos.$.completedAt'] = new Date();
      } else {
        updateFields['todos.$.completedAt'] = null;
      }
    }

    const goal = await DailyGoal.findOneAndUpdate(
      { user: userId, 'todos.id': todoId },
      { $set: updateFields },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Update statistics
    goal.completedTodos = goal.todos.filter(todo => todo.completed).length;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    console.log("Error in updateTodo controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete todo item
export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user._id;

    const goal = await DailyGoal.findOneAndUpdate(
      { user: userId },
      { 
        $pull: { todos: { id: todoId } },
        $inc: { totalTodos: -1 }
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // Update statistics
    goal.completedTodos = goal.todos.filter(todo => todo.completed).length;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    console.log("Error in deleteTodo controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper functions
const calculateStreak = async (userId) => {
  try {
    // Get sessions from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await StudySession.find({
      user: userId,
      completed: true,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    if (sessions.length === 0) return 0;

    // Group sessions by day
    const sessionsByDay = {};
    sessions.forEach(session => {
      const day = session.createdAt.toDateString();
      if (!sessionsByDay[day]) {
        sessionsByDay[day] = [];
      }
      sessionsByDay[day].push(session);
    });

    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (streak < 30) {
      const dayString = currentDate.toDateString();
      if (sessionsByDay[dayString] && sessionsByDay[dayString].length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
};

const getWeeklyProgress = async (userId) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      user: userId,
      completed: true,
      createdAt: { $gte: weekAgo }
    });

    const dailyProgress = Array(7).fill(0);
    const today = new Date();

    sessions.forEach(session => {
      const sessionDate = new Date(session.createdAt);
      const diffTime = today.getTime() - sessionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 7) {
        dailyProgress[6 - diffDays] += session.duration;
      }
    });

    return dailyProgress.map(minutes => Math.round((minutes / 60) * 100) / 100);
  } catch (error) {
    console.error("Error getting weekly progress:", error);
    return Array(7).fill(0);
  }
};

const determineLevelFromProblems = (problemCount) => {
  if (problemCount < 10) return 'Beginner';
  if (problemCount < 50) return 'Intermediate';
  if (problemCount < 100) return 'Advanced';
  return 'Expert';
};