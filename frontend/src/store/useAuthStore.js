
import { create } from "zustand";
import { initSocket, disconnectSocket } from '../lib/socket';

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: 'include' // Important for cookies
      });
      
      // Check if response is HTML (indicating backend is not reachable)
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.log("Backend server may not be running - received HTML instead of JSON");
        set({ authUser: null, isCheckingAuth: false });
        return;
      }
      
      // Try to parse as JSON
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      set({ authUser: data });
      // Initialize WebSocket connection after successful auth check
      if (data?._id) {
        initSocket(data._id);
      }
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      // Check for HTML response
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error("Backend server may not be running");
      }
      
      const userData = await res.json();
      if (!res.ok) {
        throw new Error(userData.error || "Something went wrong");
      }
      
      set({ authUser: userData });
      // Initialize WebSocket after successful signup
      if (userData?._id) {
        initSocket(userData._id);
      }
      
      return userData;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      // Check for HTML response
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error("Backend server may not be running");
      }
      
      const userData = await res.json();
      if (!res.ok) {
        throw new Error(userData.error || "Something went wrong");
      }
      
      set({ authUser: userData });
      // Initialize WebSocket after successful login
      if (userData?._id) {
        initSocket(userData._id);
      }
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include',
      });
    } catch (error) {
      console.log("Error in logout:", error.message);
    } finally {
      // Disconnect WebSocket on logout
      disconnectSocket();
      // Clear the frontend state
      set({ authUser: null });
    }
  },
  
  // Handle online users list update from WebSocket
  setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
  }
}));

export { useAuthStore };
