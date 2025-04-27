import { io } from 'socket.io-client';

// Create a socket instance
let socket;

// Initialize socket connection
export const initSocket = (userId) => {
  if (socket) return socket;
  
  socket = io('http://localhost:3000', {
    query: { userId },
  });
  
  console.log('🔌 Connecting socket...');
  
  socket.on('connect', () => {
    console.log('✅ Socket connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });
  
  return socket;
};

// Get the socket instance
export default socket;
