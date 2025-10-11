// store/useRoomStore.js
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { getSocket } from '../lib/socket';
import { API_BASE_URL } from '../lib/config'; // ✅ ADD THIS


export const useRoomStore = create((set, get) => ({
  // State
  rooms: [],
  currentRoom: null,
  roomMessages: [],
  isLoading: false,
  isCreatingRoom: false,
  isJoiningRoom: false,
  
  // Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  // Fetch all rooms with filters
  fetchRooms: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      
      const res = await fetch(`${API_BASE_URL}/rooms?${queryParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch rooms');
      }
      
      const rooms = await res.json();
      set({ rooms, isLoading: false });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(error.message);
      set({ isLoading: false });
    }
  },

  // Create a new room
  createRoom: async (roomData) => {
    set({ isCreatingRoom: true });
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(roomData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create room');
      }

      const newRoom = await res.json();
      
      // Add new room to the list
      set(state => ({
        rooms: [newRoom, ...state.rooms],
        isCreatingRoom: false
      }));
      
      toast.success('Room created successfully!');
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error.message);
      set({ isCreatingRoom: false });
      throw error;
    }
  },

  // Join a room
  joinRoom: async (roomId) => {
    set({ isJoiningRoom: true });
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/join/${roomId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to join room');
      }

      // Update room in the list to include current user as member
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId 
            ? { ...room, members: [...room.members, { _id: 'current_user_id' }] }
            : room
        ),
        isJoiningRoom: false
      }));
      
      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit('join-room', roomId);
      }
      
      toast.success('Successfully joined the room!');
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error(error.message);
      set({ isJoiningRoom: false });
      throw error;
    }
  },

  // Leave a room
  leaveRoom: async (roomId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/leave/${roomId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to leave room');
      }

      // Update room in the list to remove current user as member
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId 
            ? { ...room, members: room.members.filter(m => m._id !== 'current_user_id') }
            : room
        ),
        currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom
      }));
      
      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit('leave-room', roomId);
      }
      
      toast.success('Successfully left the room');
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error(error.message);
      throw error;
    }
  },

  // Fetch messages for a specific room
  fetchRoomMessages: async (roomId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch messages');
      }

      const messages = await res.json();
      set({ roomMessages: messages });
    } catch (error) {
      console.error('Error fetching room messages:', error);
      toast.error(error.message);
    }
  },

  // Send message to room
  sendRoomMessage: async (roomId, messageData) => {
    try {
      const socket = getSocket();
      if (!socket) {
        throw new Error('Socket connection not available');
      }

      // Emit message through socket for real-time delivery
      socket.emit('room-message', {
        roomId,
        ...messageData
      });

    } catch (error) {
      console.error('Error sending room message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  },

  // Add message to room messages (for real-time updates)
  addRoomMessage: (message) => {
    set(state => ({
      roomMessages: [...state.roomMessages, message]
    }));
  },

  // Update room (for moderators/creators)
  updateRoom: async (roomId, updateData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update room');
      }

      const updatedRoom = await res.json();
      
      // Update room in the list
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId ? updatedRoom : room
        ),
        currentRoom: state.currentRoom?._id === roomId ? updatedRoom : state.currentRoom
      }));
      
      toast.success('Room updated successfully!');
      return updatedRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error(error.message);
      throw error;
    }
  },

  // Delete room (for creators only)
  deleteRoom: async (roomId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete room');
      }

      // Remove room from the list
      set(state => ({
        rooms: state.rooms.filter(room => room._id !== roomId),
        currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom
      }));
      
      toast.success('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error(error.message);
      throw error;
    }
  },

  // Clear room messages
  clearRoomMessages: () => set({ roomMessages: [] }),

  // Subscribe to room events
  subscribeToRoomEvents: () => {
    const socket = getSocket();
    if (!socket) return;

    // Listen for new room messages
    socket.on('new-room-message', (message) => {
      get().addRoomMessage(message);
    });

    // Listen for user joining room
    socket.on('user-joined-room', ({ roomId, user }) => {
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId 
            ? { ...room, members: [...room.members, user] }
            : room
        )
      }));
      toast.success(`${user.fullName} joined the room`);
    });

    // Listen for user leaving room
    socket.on('user-left-room', ({ roomId, userId }) => {
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId 
            ? { ...room, members: room.members.filter(m => m._id !== userId) }
            : room
        )
      }));
    });

    // Listen for room updates
    socket.on('room-updated', (updatedRoom) => {
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === updatedRoom._id ? updatedRoom : room
        ),
        currentRoom: state.currentRoom?._id === updatedRoom._id ? updatedRoom : state.currentRoom
      }));
    });

    // Listen for room deletion
    socket.on('room-deleted', (roomId) => {
      set(state => ({
        rooms: state.rooms.filter(room => room._id !== roomId),
        currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom
      }));
      toast.info('Room has been deleted');
    });
  },

  // Unsubscribe from room events
  unsubscribeFromRoomEvents: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off('new-room-message');
    socket.off('user-joined-room');
    socket.off('user-left-room');
    socket.off('room-updated');
    socket.off('room-deleted');
  },
}));