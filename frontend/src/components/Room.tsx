import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Drawer,
  Badge,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeEditor from './CodeEditor';
import UserPresence from './UserPresence';
import Chat from './Chat';
import CodeExecution from './CodeExecution';
import socket from '../services/socket';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9f',
    },
    background: {
      default: '#151515',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(29, 29, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 255, 159, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(29, 29, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(0, 255, 159, 0.1)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 255, 159, 0.05)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 159, 0.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 159, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

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

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [newMessages, setNewMessages] = useState(0);
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    const userInfo = getStoredUserInfo(roomId);
    
    const joinRoom = () => {
      console.log('Joining room:', roomId);
      socket.emit('join-room', {
        roomId,
        user: {
          name: userInfo.name,
          color: userInfo.color,
        }
      });
    };

    // Join room when socket connects
    socket.on('connect', joinRoom);

    // Initial join if already connected
    if (socket.connected) {
      joinRoom();
    }

    const handleNewMessage = () => {
      if (!showChat) {
        setNewMessages(prev => prev + 1);
        setNotification({ show: true, message: 'New message received!' });
      }
    };

    const handleUserJoined = (users: any[]) => {
      console.log('Users in room:', users);
      setNotification({ 
        show: true, 
        message: `${users[users.length - 1].name} joined the room` 
      });
    };

    const handleUserLeft = (users: any[]) => {
      console.log('Users in room after leave:', users);
    };

    socket.on('chat-message', handleNewMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('chat-message', handleNewMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);

      // Leave room when component unmounts
      if (socket.connected) {
        console.log('Leaving room:', roomId);
        socket.emit('join-room', {
          roomId: '',
          user: {
            name: userInfo.name,
            color: userInfo.color,
          }
        });
      }
    };
  }, [roomId, navigate, showChat]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleChatOpen = () => {
    setShowChat(true);
    setNewMessages(0);
  };

  if (!roomId) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#151515',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 159, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <AppBar position="static" elevation={0}>
          <Toolbar variant="dense" sx={{ minHeight: 48 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ 
                mr: 2,
                '&:hover': {
                  color: '#00ff9f',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'rgba(0, 255, 159, 0.1)',
              px: 2,
              py: 0.5,
              borderRadius: '4px',
            }}>
              <CodeIcon sx={{ color: '#00ff9f', fontSize: 20 }} />
              <Typography variant="body1" sx={{ 
                fontFamily: 'JetBrains Mono',
                color: '#00ff9f',
                fontSize: '0.9rem',
              }}>
                {roomId}
              </Typography>
            </Box>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 120,
                ml: 2,
                '& .MuiOutlinedInput-root': {
                  height: 32,
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 255, 159, 0.2)',
                  '&:hover': {
                    border: '1px solid rgba(0, 255, 159, 0.5)',
                  },
                },
              }}
            >
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as string)}
                variant="outlined"
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="typescript">TypeScript</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="cpp">C++</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => setShowUsers(!showUsers)}
                sx={{
                  color: showUsers ? '#00ff9f' : 'inherit',
                  border: showUsers ? '1px solid rgba(0, 255, 159, 0.5)' : '1px solid transparent',
                }}
              >
                <PeopleIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleChatOpen}
                sx={{
                  color: showChat ? '#00ff9f' : 'inherit',
                  border: showChat ? '1px solid rgba(0, 255, 159, 0.5)' : '1px solid transparent',
                }}
              >
                <Badge 
                  badgeContent={newMessages} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#f50057',
                      border: '2px solid #1d1d1d',
                    },
                  }}
                >
                  <ChatIcon />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => setShowOutput(!showOutput)}
                sx={{
                  color: showOutput ? '#00ff9f' : 'inherit',
                  border: showOutput ? '1px solid rgba(0, 255, 159, 0.5)' : '1px solid transparent',
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
        }}>
          <Box sx={{ 
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            filter: (showChat || showUsers) ? 'blur(8px)' : 'none',
            transition: 'filter 0.3s ease',
          }}>
            <CodeEditor
              roomId={roomId}
              language={language}
              theme={editorTheme}
              onCodeChange={handleCodeChange}
            />

            {showOutput && (
              <Box sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '40vh',
                filter: (showChat || showUsers) ? 'blur(8px)' : 'none',
                transition: 'filter 0.3s ease',
              }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(29, 29, 29, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(0, 255, 159, 0.1)',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid rgba(0, 255, 159, 0.1)',
                  }}>
                    <Typography variant="subtitle2" sx={{ pl: 1, color: '#00ff9f' }}>
                      Output
                    </Typography>
                    <IconButton 
                      onClick={() => setShowOutput(false)} 
                      size="small"
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ height: 'calc(40vh - 48px)', overflow: 'auto' }}>
                    <CodeExecution code={code} language={language} />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>

          <Box sx={{ 
            position: 'fixed',
            top: 48,
            right: 0,
            bottom: 0,
            display: 'flex',
            gap: 2,
            p: 2,
            pointerEvents: 'none',
            zIndex: 1200,
          }}>
            <Box sx={{ 
              display: 'flex',
              gap: 2,
              height: '100%',
              pointerEvents: 'none',
            }}>
              {showUsers && (
                <Paper
                  elevation={0}
                  sx={{
                    width: 250,
                    height: '100%',
                    backgroundColor: 'rgba(29, 29, 29, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 159, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    pointerEvents: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Box sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0, 255, 159, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#00ff9f' }}>
                      Connected Users
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setShowUsers(false)}
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <UserPresence roomId={roomId} />
                  </Box>
                </Paper>
              )}

              {showChat && (
                <Paper
                  elevation={0}
                  sx={{
                    width: 320,
                    height: '100%',
                    backgroundColor: 'rgba(29, 29, 29, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 159, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    pointerEvents: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Box sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0, 255, 159, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#00ff9f' }}>
                      Chat Room
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setShowChat(false)}
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Chat roomId={roomId} />
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={notification.show}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, show: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              width: '100%',
              backgroundColor: 'rgba(29, 29, 29, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#00ff9f',
              border: '1px solid rgba(0, 255, 159, 0.2)',
              '& .MuiAlert-icon': {
                color: '#00ff9f',
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Room; 