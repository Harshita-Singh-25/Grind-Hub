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
        credentials: 'include'
      });
      
      console.log("Auth check response status:", res.status); // Debug log
      
      // If not 200, handle error
      if (!res.ok) {
        if (res.status === 401) {
          console.log("No valid token - user not authenticated");
          set({ authUser: null, isCheckingAuth: false });
          return;
        }
        
        // Try to get error message from response
        const errorText = await res.text();
        console.log("Auth check error response:", errorText);
        
        // Try to parse as JSON, fallback to text
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      // Check content type
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.log("Backend server may not be running - received HTML instead of JSON");
        set({ authUser: null, isCheckingAuth: false });
        return;
      }
      
      const data = await res.json();
      console.log("Auth check successful:", data); // Debug log
      
      set({ authUser: data });
      
      // Initialize WebSocket connection after successful auth check
      if (data?._id) {
        initSocket(data._id);
      }
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      console.log("Full error:", error); // More detailed logging
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ... rest of your auth methods remain the same
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
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error("Backend server may not be running");
      }
      
      const userData = await res.json();
      if (!res.ok) {
        throw new Error(userData.error || "Something went wrong");
      }
      
      set({ authUser: userData });
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
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error("Backend server may not be running");
      }
      
      const userData = await res.json();
      if (!res.ok) {
        throw new Error(userData.error || "Something went wrong");
      }
      
      set({ authUser: userData });
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
      disconnectSocket();
      set({ authUser: null });
    }
  },
  
  setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
  }
}));

export { useAuthStore };