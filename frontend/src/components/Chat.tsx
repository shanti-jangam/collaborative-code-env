import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import socket from '../services/socket';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

interface ChatProps {
  roomId: string;
}

const getStoredUserInfo = (roomId: string) => {
  const storedInfo = localStorage.getItem(`chat_user_${roomId}`);
  if (storedInfo) {
    return JSON.parse(storedInfo);
  }
  const newUser = {
    name: `User${Math.floor(Math.random() * 1000)}`,
    color: '#' + Math.floor(Math.random()*16777215).toString(16),
  };
  localStorage.setItem(`chat_user_${roomId}`, JSON.stringify(newUser));
  return newUser;
};

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = useRef(getStoredUserInfo(roomId));

  useEffect(() => {
    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log('Chat: Socket connected');
      setIsConnected(true);
      // Re-join room on reconnection
      socket.emit('join-room', {
        roomId,
        user: {
          name: userInfo.current.name,
          color: userInfo.current.color,
        }
      });
    };

    const onDisconnect = () => {
      console.log('Chat: Socket disconnected');
      setIsConnected(false);
    };

    const onRoomState = (state: { messages: Message[] }) => {
      console.log('Chat: Received room state:', state);
      if (state.messages) {
        setMessages(state.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    };

    const onChatMessage = (message: Message) => {
      console.log('Chat: Received message:', message);
      setMessages(prevMessages => [...prevMessages, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-state', onRoomState);
    socket.on('chat-message', onChatMessage);

    // Initial connection status
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room-state', onRoomState);
      socket.off('chat-message', onChatMessage);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        user: userInfo.current.name,
        text: newMessage.trim(),
        timestamp: new Date(),
      };

      console.log('Chat: Sending message:', message);
      socket.emit('chat-message', { roomId, message });
      setNewMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getMessageDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
           messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
        {messages.map((message, index) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: message.user === userInfo.current.name ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
            }}>
              <Typography variant="caption" color="text.secondary">
                {message.user}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getMessageDate(message.timestamp)}
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                backgroundColor: message.user === userInfo.current.name 
                  ? 'rgba(0, 255, 159, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={isConnected ? "Type a message..." : "Disconnected..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!isConnected || !newMessage.trim()}
            sx={{
              color: '#00ff9f',
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat; 