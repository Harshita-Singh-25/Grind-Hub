
// src/lib/config.js - Centralized API configuration

const isDevelopment = import.meta.env.MODE === "development";

export const API_BASE_URL = isDevelopment 
  ? "http://localhost:5001/api" 
  : "https://grind-hub-backend.onrender.com/api";

export const SOCKET_URL = isDevelopment
  ? "http://localhost:5001"
  : "https://grind-hub-backend.onrender.com";

// You can also add other config variables here
export const config = {
  apiBaseUrl: API_BASE_URL,
  socketUrl: SOCKET_URL,
  isDevelopment,
};