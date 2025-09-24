import express from "express";
//import { protectRoute } from "../middleware/protectRoute.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  getProblems, 
  getProblem, 
  createProblem,
  updateProblem,
  deleteProblem,
  likeProblem
} from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", protectRoute, getProblems);
router.get("/:id", protectRoute, getProblem);
router.post("/", protectRoute, createProblem);
router.put("/:id", protectRoute, updateProblem);
router.delete("/:id", protectRoute, deleteProblem);
router.post("/:id/like", protectRoute, likeProblem);

export default router;