import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";


export const axiosInstance = axios.create({
  //baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  //baseURL: import.meta.env.VITE_BACKEND_URL,
  baseURL: isDevelopment 
    ? "http://localhost:5001/api" 
    : "https://grind-hub-backend.onrender.com/api",
  withCredentials: true,
});
