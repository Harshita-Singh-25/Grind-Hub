import { create } from "zustand";

const useProblemStore = create((set, get) => ({
  problems: [],
  currentProblem: null,
  isLoading: false,

  fetchProblems: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/problems?${queryParams}`);
      const data = await res.json();
      set({ problems: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching problems:", error);
      set({ isLoading: false });
    }
  },

  createProblem: async (problemData) => {
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemData),
      });
      const newProblem = await res.json();
      set((state) => ({ problems: [newProblem, ...state.problems] }));
      return newProblem;
    } catch (error) {
      console.error("Error creating problem:", error);
      throw error;
    }
  },

  likeProblem: async (problemId) => {
    try {
      const res = await fetch(`/api/problems/${problemId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        set((state) => ({
          problems: state.problems.map(problem =>
            problem._id === problemId
              ? { ...problem, likes: (problem.likes || 0) + 1 }
              : problem
          )
        }));
      }
    } catch (error) {
      console.error("Error liking problem:", error);
    }
  },

  setCurrentProblem: (problem) => set({ currentProblem: problem }),
}));

export { useProblemStore };