import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { roomService } from './services/roomService';
import { codeExecutionService } from './services/codeExecutionService';
import { User, Message } from './types';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-editor')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Track connected sockets
const connectedSockets = new Set<string>();

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  connectedSockets.add(socket.id);
  let currentRoom = '';

  socket.on('join-room', ({ roomId, user }: { roomId: string; user: User }) => {
    console.log(`User ${socket.id} attempting to join room ${roomId}`);
    
    // Store room and user data in socket
    socket.data.roomId = roomId;
    socket.data.user = user;
    
    // Leave previous room if any
    if (currentRoom) {
      console.log(`User ${socket.id} leaving room ${currentRoom}`);
      socket.leave(currentRoom);
      const prevRoom = roomService.removeUser(currentRoom, socket.id);
      if (prevRoom) {
        io.to(currentRoom).emit('users', prevRoom.users);
      }
    }

    // Create or get room
    let room = roomService.getRoom(roomId);
    if (!room) {
      console.log(`Creating new room ${roomId}`);
      room = roomService.createRoom(roomId);
    }

    // Add user to room with socket ID
    currentRoom = roomId;
    const updatedRoom = roomService.addUser(roomId, { ...user, id: socket.id });
    
    if (updatedRoom) {
      socket.join(roomId);
      // Send current room state to the joining user
      socket.emit('room-state', {
        users: updatedRoom.users,
        messages: updatedRoom.messages,
        code: updatedRoom.code,
        language: updatedRoom.language
      });
      // Notify all users in the room about the current user list
      io.to(roomId).emit('users', updatedRoom.users);
      console.log(`User ${socket.id} joined room ${roomId}, current users:`, updatedRoom.users);
    }
  });

  socket.on('code-change', ({ roomId, code }: { roomId: string; code: string }) => {
    const updatedRoom = roomService.updateCode(roomId, code);
    if (updatedRoom) {
      socket.to(roomId).emit('code-change', code);
    }
  });

  socket.on('chat-message', ({ roomId, message }: { roomId: string; message: Message }) => {
    console.log('Received chat message:', message, 'for room:', roomId);
    const updatedRoom = roomService.addMessage(roomId, message);
    if (updatedRoom) {
      // Broadcast to all clients in the room, including sender
      io.to(roomId).emit('chat-message', message);
    }
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    const user = socket.data.user;

    if (roomId && user) {
      roomService.removeUser(roomId, user);
      socket.to(roomId).emit('user-left', user);
      
      // Get updated user list after removal
      const room = roomService.getRoom(roomId);
      if (room) {
        io.to(roomId).emit('users', room.users);
      }
    }

    roomService.cleanupDisconnectedUsers();
  });
});

// Code Execution Endpoint
app.post('/execute', async (req, res) => {
  try {
    const result = await codeExecutionService.executeCode(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Collaborative Code Editor API' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 