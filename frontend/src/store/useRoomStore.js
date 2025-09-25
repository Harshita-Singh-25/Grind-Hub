import { create } from "zustand";

const useRoomStore = create((set, get) => ({
  rooms: [],
  currentRoom: null,
  roomMessages: [],
  isLoading: false,

  fetchRooms: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/rooms?${queryParams}`);
      const data = await res.json();
      set({ rooms: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ isLoading: false });
    }
  },

  createRoom: async (roomData) => {
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      const newRoom = await res.json();
      set((state) => ({ rooms: [newRoom, ...state.rooms] }));
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  joinRoom: async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/join/${roomId}`, {
        method: "POST",
      });
      if (res.ok) {
        get().fetchRooms();
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  },

  setCurrentRoom: (room) => set({ currentRoom: room }),

  fetchRoomMessages: async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/messages`);
      const messages = await res.json();
      set({ roomMessages: messages });
    } catch (error) {
      console.error("Error fetching room messages:", error);
    }
  },
}));

export { useRoomStore };