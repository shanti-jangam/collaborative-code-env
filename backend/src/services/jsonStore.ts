import fs from 'fs';
import path from 'path';
import { User, Message, Room } from '../types';

// Define the data file path
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

// Define the data structure
interface DataStore {
  rooms: {
    [key: string]: Room;
  };
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Created data directory at:', DATA_DIR);
}

// Initialize with empty data if file doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ rooms: {} }, null, 2));
  console.log('Initialized empty data store at:', DATA_FILE);
}

// Load data
let data: DataStore;
try {
  data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log('Loaded data from:', DATA_FILE);
} catch (error) {
  console.error('Error loading data, initializing empty store:', error);
  data = { rooms: {} };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Save data function - throttled to prevent excessive writes
let saveTimeout: NodeJS.Timeout | null = null;
const saveData = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      console.log('Data saved to:', DATA_FILE);
    } catch (error) {
      console.error('Error saving data:', error);
    }
    saveTimeout = null;
  }, 500); // Throttle to max one write every 500ms
};

// Export methods to work with rooms
export const jsonStore = {
  /**
   * Get a room by ID
   * @param roomId Room ID
   * @returns Room object or undefined if not found
   */
  getRoom(roomId: string): Room | undefined {
    return data.rooms[roomId];
  },
  
  /**
   * Get all rooms
   * @returns Array of all rooms
   */
  getAllRooms(): Room[] {
    return Object.values(data.rooms);
  },
  
  /**
   * Create a new room
   * @param roomId Room ID
   * @returns The created room
   */
  createRoom(roomId: string): Room {
    const room: Room = {
      id: roomId,
      users: [],
      messages: [],
      code: '',
      language: 'javascript'
    };
    data.rooms[roomId] = room;
    saveData();
    return room;
  },
  
  /**
   * Add a user to a room
   * @param roomId Room ID
   * @param user User to add
   * @returns Updated room or undefined if room not found
   */
  addUser(roomId: string, user: User): Room | undefined {
    const room = data.rooms[roomId];
    if (!room) return undefined;
    
    // Remove any existing user with the same ID
    room.users = room.users.filter(u => u.id !== user.id);
    
    // Add the new user
    room.users.push(user);
    saveData();
    return room;
  },
  
  /**
   * Remove a user from a room
   * @param roomId Room ID
   * @param userId User ID to remove
   * @returns Updated room or undefined if room not found
   */
  removeUser(roomId: string, userId: string): Room | undefined {
    const room = data.rooms[roomId];
    if (!room) return undefined;
    
    room.users = room.users.filter(user => user.id !== userId);
    saveData();
    return room;
  },
  
  /**
   * Update the code in a room
   * @param roomId Room ID
   * @param code New code content
   * @returns Updated room or undefined if room not found
   */
  updateCode(roomId: string, code: string): Room | undefined {
    const room = data.rooms[roomId];
    if (!room) return undefined;
    
    room.code = code;
    saveData();
    return room;
  },
  
  /**
   * Update the language in a room
   * @param roomId Room ID
   * @param language New language
   * @returns Updated room or undefined if room not found
   */
  updateLanguage(roomId: string, language: string): Room | undefined {
    const room = data.rooms[roomId];
    if (!room) return undefined;
    
    room.language = language;
    saveData();
    return room;
  },
  
  /**
   * Add a message to a room
   * @param roomId Room ID
   * @param message Message to add
   * @returns Updated room or undefined if room not found
   */
  addMessage(roomId: string, message: Message): Room | undefined {
    const room = data.rooms[roomId];
    if (!room) return undefined;
    
    room.messages.push(message);
    
    // Keep only the most recent 100 messages
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }
    
    saveData();
    return room;
  },
  
  /**
   * Delete a room
   * @param roomId Room ID to delete
   * @returns True if room was deleted, false if not found
   */
  deleteRoom(roomId: string): boolean {
    if (!data.rooms[roomId]) return false;
    
    delete data.rooms[roomId];
    saveData();
    return true;
  },
  
  /**
   * Clean up empty rooms (no users)
   */
  cleanupEmptyRooms(): void {
    let cleaned = false;
    
    for (const roomId in data.rooms) {
      const room = data.rooms[roomId];
      if (room.users.length === 0) {
        delete data.rooms[roomId];
        cleaned = true;
        console.log(`Cleaned up empty room: ${roomId}`);
      }
    }
    
    if (cleaned) {
      saveData();
    }
  }
}; 