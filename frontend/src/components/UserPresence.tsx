import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, CircularProgress } from '@mui/material';
import socket from '../services/socket';

interface User {
  id: string;
  name: string;
  color: string;
}

interface UserPresenceProps {
  roomId: string;
}

const UserPresence: React.FC<UserPresenceProps> = ({ roomId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log('UserPresence: Socket connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('UserPresence: Socket disconnected');
      setIsConnected(false);
    };

    const handleRoomState = (state: { users: User[] }) => {
      console.log('UserPresence: Room state received:', state);
      setUsers(state.users || []);
      setIsLoading(false);
    };

    const handleUserJoined = (userList: User[]) => {
      console.log('UserPresence: User joined, new user list:', userList);
      setUsers(userList);
    };

    const handleUserLeft = (userList: User[]) => {
      console.log('UserPresence: User left, new user list:', userList);
      setUsers(userList);
    };

    // Listen for room state and user events
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-state', handleRoomState);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);

    // Set initial connection status
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room-state', handleRoomState);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
    };
  }, [roomId]);

  if (!isConnected) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Disconnected
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={20} sx={{ color: '#00ff9f' }} />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No users connected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 1, 
      p: 2
    }}>
      {users.map((user) => (
        <Box
          key={user.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: 'rgba(0, 255, 159, 0.05)',
            '&:hover': {
              bgcolor: 'rgba(0, 255, 159, 0.1)',
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: user.color,
              width: 32,
              height: 32,
              fontSize: '0.875rem',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">
            {user.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default UserPresence; 