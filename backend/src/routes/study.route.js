import express from "express";
//import { protectRoute } from "../middleware/protectRoute.js";
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
  startStudySession, 
  endStudySession, 
  getStudyStats,
  //getDailyGoal,
  //updateDailyGoal
} from "../controllers/study.controller.js";

const router = express.Router();

router.post("/session/start", protectRoute, startStudySession);
router.post("/session/end", protectRoute, endStudySession);
router.get("/stats", protectRoute, getStudyStats);
router.get("/goal", protectRoute, getDailyGoal);
router.put("/goal", protectRoute, updateDailyGoal);

export default router;