import { create } from "zustand";

const useStudyStore = create((set, get) => ({
  studyStats: null,
  currentSession: null,
  studyHistory: [],
  dailyGoal: { target: 60, current: 0 },
  isLoading: false,

  fetchStudyStats: async () => {
    try {
      const res = await fetch("/api/study/stats");
      const stats = await res.json();
      set({ studyStats: stats });
    } catch (error) {
      console.error("Error fetching study stats:", error);
    }
  },

  startStudySession: async (sessionData) => {
    try {
      const res = await fetch("/api/study/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      const session = await res.json();
      set({ currentSession: session });
      return session;
    } catch (error) {
      console.error("Error starting study session:", error);
      throw error;
    }
  },

  endStudySession: async (sessionId, sessionData) => {
    try {
      const res = await fetch("/api/study/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...sessionData }),
      });
      if (res.ok) {
        set({ currentSession: null });
        get().fetchStudyStats();
      }
    } catch (error) {
      console.error("Error ending study session:", error);
    }
  },

  updateDailyGoal: async (target) => {
    try {
      const res = await fetch("/api/study/goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      if (res.ok) {
        set((state) => ({
          dailyGoal: { ...state.dailyGoal, target }
        }));
      }
    } catch (error) {
      console.error("Error updating daily goal:", error);
    }
  },
}));

export { useStudyStore };