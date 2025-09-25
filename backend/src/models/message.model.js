import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room" 
  },
  text: { type: String },
  image: { type: String },
  message: { type: String },
  messageType: {
    type: String,
    enum: ['text', 'code', 'problem-link', 'file', 'voice-note'],
    default: 'text'
  },
  codeLanguage: String, // for code messages
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String
  }]
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);