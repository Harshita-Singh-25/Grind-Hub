
import { create } from "zustand";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

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
        credentials: 'include', // Add this for cookies
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
    } catch (error) {
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
        credentials: 'include', // Add this for cookies
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
    } catch (error) {
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include', // Add this for cookies
      });
      
      // Even if logout fails, clear frontend state
      set({ authUser: null });
      
      if (!res.ok) {
        console.log("Logout failed on backend, but cleared frontend state");
      }
    } catch (error) {
      console.log("Error in logout:", error);
      // Still clear the frontend state
      set({ authUser: null });
    }
  },
}));

export { useAuthStore };



// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//   authUser: null,
//   isSigningUp: false,
//   isLoggingIn: false,
//   isUpdatingProfile: false,
//   isCheckingAuth: true,

//   checkAuth: async () => {
//     try {
//       const res = await fetch("/api/auth/check");
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }
//       set({ authUser: data });
//     } catch (error) {
//       console.log("Error in checkAuth:", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       const userData = await res.json();
//       if (!res.ok) {
//         throw new Error(userData.error || "Something went wrong");
//       }
//       set({ authUser: userData });
//     } catch (error) {
//       throw error;
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       const userData = await res.json();
//       if (!res.ok) {
//         throw new Error(userData.error || "Something went wrong");
//       }
//       set({ authUser: userData });
//     } catch (error) {
//       throw error;
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       const res = await fetch("/api/auth/logout", {
//         method: "POST",
//       });
//       if (!res.ok) {
//         throw new Error("Something went wrong");
//       }
//       set({ authUser: null });
//     } catch (error) {
//       console.log("Error in logout:", error);
//       throw error;
//     }
//   },
// }));

// export { useAuthStore };



// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isSigningUp: false,
//   isLoggingIn: false,
//   isUpdatingProfile: false,
//   isCheckingAuth: true,
//   onlineUsers: [],
//   socket: null,

//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");

//       set({ authUser: res.data });
//       get().connectSocket();
//     } catch (error) {
//       console.log("Error in checkAuth:", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });
//       toast.success("Account created successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged in successfully");

//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   },

//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("error in update profile:", error);
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       query: {
//         userId: authUser._id,
//       },
//     });
//     socket.connect();

//     set({ socket: socket });

//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },
//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },
// }));
