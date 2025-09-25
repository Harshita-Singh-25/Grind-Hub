import StudySession from "../models/studySession.model.js";
//import StudySession from "../models/StudySession.js";
import User from "../models/user.model.js";

export const startStudySession = async (req, res) => {
  try {
    const { type, problem, notes } = req.body;
    
    const session = new StudySession({
      user: req.user._id,
      type,
      problem: problem || undefined,
      notes,
      duration: 0
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
    
    const session = await StudySession.findByIdAndUpdate(
      sessionId,
      {
        duration,
        notes,
        completed,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update user stats
    if (completed) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalProblems: session.type === 'problem-solving' ? 1 : 0 },
        lastActive: new Date()
      });
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
    
    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await StudySession.find({
      user: userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayHours = todaySessions.reduce((total, session) => total + session.duration, 0) / 60;

    // Get user data
    const user = await User.findById(userId);

    // Calculate streak (simplified)
    const streak = await calculateStreak(userId);

    const stats = {
      streak,
      totalProblems: user.totalProblems || 0,
      todayHours: Math.round(todayHours * 100) / 100,
      currentLevel: user.currentLevel || 'beginner',
      weeklyProgress: await getWeeklyProgress(userId)
    };

    res.status(200).json(stats);
  } catch (error) {
    console.log("Error in getStudyStats controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const calculateStreak = async (userId) => {
  // Simplified streak calculation
  const sessions = await StudySession.find({ 
    user: userId,
    completed: true 
  }).sort({ createdAt: -1 }).limit(30);

  let streak = 0;
  let currentDate = new Date();
  
  for (let session of sessions) {
    const sessionDate = new Date(session.createdAt);
    const diffTime = Math.abs(currentDate - sessionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

const getWeeklyProgress = async (userId) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sessions = await StudySession.find({
    user: userId,
    createdAt: { $gte: weekAgo }
  });

  const dailyProgress = {};
  
  sessions.forEach(session => {
    const day = session.createdAt.toDateString();
    if (!dailyProgress[day]) {
      dailyProgress[day] = 0;
    }
    dailyProgress[day] += session.duration;
  });

  return dailyProgress;
};