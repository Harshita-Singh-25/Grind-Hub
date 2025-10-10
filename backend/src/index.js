import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import roomRoutes from "./routes/room.route.js"; // Add this
import problemRoutes from "./routes/problem.route.js"; // Add this


dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


const allowedOrigins = [
    "http://localhost:5173",
    "https://grind-hub-frontend.vercel.app",
    "https://grind-hub-frontend.onrender.com"
];

app.use(express.json({ limit: '10mb' }));

//app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));



// ✅ DEBUG ROUTES (Remove after testing)
app.get("/", (req, res) => {
  res.json({ 
    message: "GrindHub Backend API",
    version: "1.0.0",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});



console.log("📋 Registering API routes...");
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes); // Add this
app.use("/api/problems", problemRoutes); // Add this
app.use("/api/study", (await import("./routes/study.route.js")).default);


//THIS IS USED WHEN DEPLOYING STATIC FILES , I.E WHEN BOTH FRONTEND AND BACKEND ARE DEPLOYED TOGETHER
/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
*/

// ✅ 404 Handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`❌ 404 - API endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
    message: "The requested API endpoint does not exist"
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("Stack:", err.stack);
  
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
