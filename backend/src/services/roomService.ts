import { Room, User, Message } from '../types';

class RoomService {
  private rooms: Map<string, Room> = new Map();

  createRoom(roomId: string): Room {
    const room: Room = {
      id: roomId,
      users: [],
      messages: [],
      code: '',
      language: 'javascript',
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  addUser(roomId: string, user: User): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      // Remove any existing user with the same name or socket ID
      room.users = room.users.filter((u) => u.name !== user.name && u.id !== user.id);
      // Add the new user
      room.users.push(user);
      return room;
    }
    return undefined;
  }

  removeUser(roomId: string, userId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users = room.users.filter((user) => user.id !== userId);
      
      // If room is empty, delete it
      if (room.users.length === 0) {
        this.rooms.delete(roomId);
        return undefined;
      }
      return room;
    }
    return undefined;
  }

  // Clean up disconnected users
  cleanupDisconnectedUsers() {
    for (const [roomId, room] of this.rooms.entries()) {
      // Remove any users that are no longer connected
      const activeUsers = room.users;
      if (activeUsers.length === 0) {
        // If no users left in room, remove the room
        this.rooms.delete(roomId);
      }
    }
  }

  addMessage(roomId: string, message: Message): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      room.messages.push(message);
      return room;
    }
    return undefined;
  }

  updateCode(roomId: string, code: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      room.code = code;
      return room;
    }
    return undefined;
  }

  updateLanguage(roomId: string, language: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      room.language = language;
      return room;
    }
    return undefined;
  }
}

export const roomService = new RoomService(); 