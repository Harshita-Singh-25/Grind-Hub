import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const URL = import.meta.env.VITE_SOCKET_URL; // Use the SOCKET URL from environment variables
let socket;

// Initialize the socket connection with the user ID
export const initSocket = (userId) => {
  // If socket already exists and is connected, return it
  if (socket?.connected) {
    console.log('WebSocket already connected');
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(URL, {
    query: { userId },
    withCredentials: true,
    transports: ['websocket', 'polling'], // Add this line
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
  
  // Connection established
  socket.on('connect', () => {
    console.log('Connected to WebSocket server with ID:', socket.id);
    console.log('Socket connected for user:', userId);
  });
  
  // Disconnected from server
  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
    
    // Try to reconnect if the disconnection was not initiated by the client
    if (reason === 'io server disconnect' || reason === 'ping timeout' || reason === 'transport close') {
      console.log('Attempting to reconnect...');
      socket.connect();
    }
  });
  
  // Connection error
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error.message);
    
    // Try to reconnect after a delay
    setTimeout(() => {
      console.log('Attempting to reconnect after error...');
      socket.connect();
    }, 1000);
  });
  
  // Online users list updated
  socket.on('getOnlineUsers', (userIds) => {
    console.log('Online users updated:', userIds);
    console.log('Current online users count:', userIds.length);
    
    // Ensure we have a valid array
    if (Array.isArray(userIds)) {
      useAuthStore.getState().setOnlineUsers(userIds);
      console.log('Auth store updated with online users');
    } else {
      console.error('Invalid online users data received:', userIds);
    }
  });
  
  // Handle custom events
  socket.on('newMessage', (message) => {
    console.log('New message received:', message);
    // You can add custom logic here to handle new messages
    // For example, update your messages store or show a notification
  });
  
  // Handle room events
  socket.on('roomCreated', (room) => {
    console.log('New room created:', room);
    // Handle room created event
  });
  
  socket.on('userJoinedRoom', ({ roomId, userId }) => {
    console.log(`User ${userId} joined room ${roomId}`);
    // Handle user joined room event
  });
  
  socket.on('userLeftRoom', ({ roomId, userId }) => {
    console.log(`User ${userId} left room ${roomId}`);
    // Handle user left room event
  });
  
  return socket;
};

// Get the current socket instance
export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Call initSocket(userId) first.');
  }
  return socket;
};

// Manually request online users list
export const requestOnlineUsers = () => {
  if (socket && socket.connected) {
    console.log('Requesting online users list...');
    socket.emit('getOnlineUsers');
  } else {
    console.warn('Socket not connected, cannot request online users');
  }
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting WebSocket...');
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('getOnlineUsers');
    socket.off('newMessage');
    socket.off('roomCreated');
    socket.off('userJoinedRoom');
    socket.off('userLeftRoom');
    
    socket.disconnect();
    socket = null;
    console.log('WebSocket disconnected');
  }
};
