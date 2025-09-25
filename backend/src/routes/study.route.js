import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getStudyStats,
  startStudySession,
  endStudySession,
  getStudyHistory,
  updateDailyGoal,
  getDailyGoal,
  addTodo,
  updateTodo,
  deleteTodo
} from "../controllers/study.controller.js";

const router = express.Router();

// Stats routes
router.get("/stats", protectRoute, getStudyStats);
router.get("/history", protectRoute, getStudyHistory);

// Session routes
router.post("/session/start", protectRoute, startStudySession);
router.post("/session/end", protectRoute, endStudySession);

// Goal routes
router.get("/goal", protectRoute, getDailyGoal);
router.put("/goal", protectRoute, updateDailyGoal);

// Todo routes
router.post("/goal/todos", protectRoute, addTodo);
router.put("/goal/todos/:todoId", protectRoute, updateTodo);
router.delete("/goal/todos/:todoId", protectRoute, deleteTodo);

export default router;