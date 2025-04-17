import { Room, User, Message } from '../types';
import { jsonStore } from './jsonStore';

class RoomService {
  createRoom(roomId: string): Room {
    return jsonStore.createRoom(roomId);
  }

  getRoom(roomId: string): Room | undefined {
    return jsonStore.getRoom(roomId);
  }

  addUser(roomId: string, user: User): Room | undefined {
    return jsonStore.addUser(roomId, user);
  }

  removeUser(roomId: string, userId: string): Room | undefined {
    return jsonStore.removeUser(roomId, userId);
  }

  // Clean up disconnected users
  cleanupDisconnectedUsers() {
    jsonStore.cleanupEmptyRooms();
  }

  addMessage(roomId: string, message: Message): Room | undefined {
    return jsonStore.addMessage(roomId, message);
  }

  updateCode(roomId: string, code: string): Room | undefined {
    return jsonStore.updateCode(roomId, code);
  }

  updateLanguage(roomId: string, language: string): Room | undefined {
    return jsonStore.updateLanguage(roomId, language);
  }
}

export const roomService = new RoomService(); 