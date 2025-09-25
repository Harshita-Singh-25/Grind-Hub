import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    console.log("Token received:", token ? "Present" : "Not present"); // Debug log

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    console.log("User found:", user ? "Yes" : "No"); // Debug log

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    console.log("Full error:", error); // More detailed error logging
    
    // Return JSON error response
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};