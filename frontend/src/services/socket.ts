import io, { Socket } from 'socket.io-client';

// Create a single socket instance
const socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
  transports: ['websocket'],
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  autoConnect: false, // Don't connect automatically
  forceNew: false, // Don't force new connection for each window
});

// Add connection event listeners
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error: Error) => {
  console.error('Socket connection error:', error.message);
});

export default socket; 