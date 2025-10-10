import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
  "http://localhost:5173",
  "https://grind-hub-frontend.vercel.app",
  "https://grind-hub-frontend.onrender.com"
];



const io = new Server(server, {
  cors: {
    origin:  allowedOrigins,
    credentials: true, // Add this line
    methods: ["GET", "POST"]
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("User ID from query:", userId);
  
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User added to socket map:", userId, "->", socket.id);
  }

  console.log("Current online users:", Object.keys(userSocketMap));
  
  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log("Emitted getOnlineUsers event to all clients");

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    console.log("Removing user from socket map:", userId);
    delete userSocketMap[userId];
    console.log("Current online users after disconnect:", Object.keys(userSocketMap));
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Emitted getOnlineUsers event after disconnect");
  });
});

export { io, app, server };
