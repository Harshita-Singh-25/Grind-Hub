import express from "express";
//import { protectRoute } from "../middleware/protectRoute.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  createRoom, 
  getRooms, 
  joinRoom, 
  leaveRoom, 
  getRoomMessages,
  updateRoom,
  deleteRoom
} from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createRoom);
router.get("/", protectRoute, getRooms);
router.post("/join/:id", protectRoute, joinRoom);
router.post("/leave/:id", protectRoute, leaveRoom);
router.get("/:id/messages", protectRoute, getRoomMessages);
router.put("/:id", protectRoute, updateRoom);
router.delete("/:id", protectRoute, deleteRoom);

export default router;