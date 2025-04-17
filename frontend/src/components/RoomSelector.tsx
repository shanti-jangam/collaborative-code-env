import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
} from '@mui/material';

const RoomSelector: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${newRoomId}`);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Collaborative Code Editor
          </Typography>
          <form onSubmit={handleJoinRoom}>
            <TextField
              fullWidth
              label="Room ID"
              variant="outlined"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Join Room
            </Button>
          </form>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleCreateRoom}
          >
            Create New Room
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default RoomSelector; 