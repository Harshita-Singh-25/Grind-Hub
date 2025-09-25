import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getStudyStats,
  startStudySession,
  endStudySession,
  getStudyHistory,
  updateDailyGoal,
  getDailyGoal
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

export default router;