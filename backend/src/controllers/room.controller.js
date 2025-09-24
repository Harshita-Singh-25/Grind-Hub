import Room from "../models/room.model.js";
import Message from "../models/message.model.js";

export const createRoom = async (req, res) => {
  try {
    const { name, description, category, difficulty, isPrivate, maxMembers, tags } = req.body;
    
    const room = new Room({
      name,
      description,
      category,
      difficulty,
      isPrivate,
      maxMembers,
      tags,
      createdBy: req.user._id,
      members: [req.user._id],
      moderators: [req.user._id]
    });

    await room.save();
    await room.populate('createdBy', 'fullName profilePic');
    
    res.status(201).json(room);
  } catch (error) {
    console.log("Error in createRoom controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search] } }
      ];
    }

    const rooms = await Room.find(filter)
      .populate('createdBy', 'fullName profilePic')
      .populate('members', 'fullName profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in getRooms controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ error: "Already a member of this room" });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ error: "Room is full" });
    }

    room.members.push(userId);
    await room.save();

    res.status(200).json({ message: "Successfully joined room" });
  } catch (error) {
    console.log("Error in joinRoom controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.members = room.members.filter(member => !member.equals(userId));
    room.moderators = room.moderators.filter(mod => !mod.equals(userId));
    
    await room.save();

    res.status(200).json({ message: "Successfully left room" });
  } catch (error) {
    console.log("Error in leaveRoom controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const roomId = req.params.id;
    
    const room = await Room.findById(roomId);
    if (!room || !room.members.includes(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({ roomId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getRoomMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updates = req.body;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Only creator or moderators can update
    if (!room.createdBy.equals(req.user._id) && !room.moderators.includes(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, { new: true })
      .populate('createdBy', 'fullName profilePic')
      .populate('members', 'fullName profilePic');

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.log("Error in updateRoom controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Only creator can delete
    if (!room.createdBy.equals(req.user._id)) {
      return res.status(403).json({ error: "Only room creator can delete" });
    }

    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log("Error in deleteRoom controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};