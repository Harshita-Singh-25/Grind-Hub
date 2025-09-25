import { create } from "zustand";

const useStudyStore = create((set, get) => ({
  studyStats: null,
  currentSession: null,
  studyHistory: [],
  dailyGoal: { target: 60, current: 0 },
  isLoading: false,
  error: null,

  // Stats methods
  fetchStudyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/study/stats", {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const stats = await res.json();
      set({ studyStats: stats, isLoading: false });
    } catch (error) {
      console.error("Error fetching study stats:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Session methods
  startStudySession: async (sessionData) => {
    set({ error: null });
    try {
      const res = await fetch("/api/study/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const session = await res.json();
      set({ currentSession: session });
      return session;
    } catch (error) {
      console.error("Error starting study session:", error);
      set({ error: error.message });
      throw error;
    }
  },

  endStudySession: async (sessionId, sessionData) => {
    set({ error: null });
    try {
      const res = await fetch("/api/study/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ sessionId, ...sessionData }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const updatedSession = await res.json();
      set({ currentSession: null });
      
      // Refresh stats and history
      get().fetchStudyStats();
      get().fetchStudyHistory();
      get().fetchDailyGoal();
      
      return updatedSession;
    } catch (error) {
      console.error("Error ending study session:", error);
      set({ error: error.message });
      throw error;
    }
  },

  // History methods
  fetchStudyHistory: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/study/history?page=${page}&limit=${limit}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const historyData = await res.json();
      set({ 
        studyHistory: historyData.sessions || [],
        isLoading: false 
      });
      return historyData;
    } catch (error) {
      console.error("Error fetching study history:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Goal methods
  fetchDailyGoal: async () => {
    set({ error: null });
    try {
      const res = await fetch("/api/study/goal", {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const goal = await res.json();
      set({ dailyGoal: goal });
      return goal;
    } catch (error) {
      console.error("Error fetching daily goal:", error);
      set({ error: error.message });
    }
  },

  updateDailyGoal: async (target) => {
    set({ error: null });
    try {
      const res = await fetch("/api/study/goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ target }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const updatedGoal = await res.json();
      set({ dailyGoal: updatedGoal });
      return updatedGoal;
    } catch (error) {
      console.error("Error updating daily goal:", error);
      set({ error: error.message });
      throw error;
    }
  },

  // Todo methods
  addTodo: async (todoData) => {
    set({ error: null });
    try {
      const res = await fetch("/api/study/goal/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(todoData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const updatedGoal = await res.json();
      set({ dailyGoal: updatedGoal });
      return updatedGoal;
    } catch (error) {
      console.error("Error adding todo:", error);
      set({ error: error.message });
      throw error;
    }
  },

  updateTodo: async (todoId, updateData) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/study/goal/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const updatedGoal = await res.json();
      set({ dailyGoal: updatedGoal });
      return updatedGoal;
    } catch (error) {
      console.error("Error updating todo:", error);
      set({ error: error.message });
      throw error;
    }
  },

  deleteTodo: async (todoId) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/study/goal/todos/${todoId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const updatedGoal = await res.json();
      set({ dailyGoal: updatedGoal });
      return updatedGoal;
    } catch (error) {
      console.error("Error deleting todo:", error);
      set({ error: error.message });
      throw error;
    }
  },

  // Utility methods
  clearError: () => set({ error: null }),
  
  clearCurrentSession: () => set({ currentSession: null }),
}));

export { useStudyStore };