import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Container,
  keyframes,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { nanoid } from 'nanoid';

const glowKeyframes = keyframes`
  0% { box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f; }
  50% { box-shadow: 0 0 10px #00ff9f, 0 0 20px #00ff9f, 0 0 30px #00ff9f; }
  100% { box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f; }
`;

const floatKeyframes = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

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
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    body1: {
      fontSize: '1.1rem',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#00ff9f',
            color: '#000000',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
  },
});

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = nanoid(8);
    navigate(`/room/${newRoomId}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(0, 255, 159, 0.1) 0%, rgba(0, 0, 0, 0) 30%),
            radial-gradient(circle at 90% 90%, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 0) 30%),
            linear-gradient(45deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.4,
            background: `
              linear-gradient(45deg, transparent 45%, rgba(0, 255, 159, 0.1) 50%, transparent 55%),
              linear-gradient(-45deg, transparent 45%, rgba(0, 229, 255, 0.1) 50%, transparent 55%)
            `,
            backgroundSize: '60px 60px',
            animation: 'moveBackground 8s linear infinite',
            '@keyframes moveBackground': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '60px 60px' },
            },
          }}
        />

        {/* Header */}
        <Box
          sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flexGrow: 1,
              animation: mounted ? `${floatKeyframes} 3s ease-in-out infinite` : 'none',
            }}
          >
            <CodeIcon sx={{ 
              color: '#00ff9f', 
              fontSize: '2.5rem',
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 159, 0.5))',
            }} />
            <Typography variant="h1" sx={{ 
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #00ff9f, #00e5ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(0, 255, 159, 0.5)',
            }}>
              DevSync
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleCreateRoom}
            startIcon={<AddIcon />}
            sx={{
              borderColor: '#00ff9f',
              color: '#00ff9f',
              backdropFilter: 'blur(10px)',
              animation: `${glowKeyframes} 2s infinite`,
              '&:hover': {
                borderColor: '#00ff9f',
                backgroundColor: 'rgba(0, 255, 159, 0.2)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            Create Workspace
          </Button>
        </Box>

        {/* Main Content */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <Typography 
              variant="h1" 
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #00ff9f 30%, #00e5ff 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 255, 159, 0.3)',
                letterSpacing: '-1px',
                lineHeight: 1.2,
              }}
            >
              Code Together,<br />Build Together
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.4rem',
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                mb: 6,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              Real-time collaborative coding environment for teams. Write, compile, and create together in perfect sync.
            </Typography>

            <Box
              component="form"
              onSubmit={handleJoinRoom}
              sx={{
                width: '100%',
                maxWidth: 600,
                mb: 6,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.4s',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                border: '1px solid rgba(0, 255, 159, 0.3)',
                p: 2,
                backgroundColor: 'rgba(0, 255, 159, 0.05)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(0, 255, 159, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 0 40px rgba(0, 255, 159, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}>
                <TextField
                  fullWidth
                  placeholder="Enter Workspace ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      },
                    },
                  }}
                />
                <IconButton 
                  type="submit"
                  disabled={!roomId.trim()}
                  sx={{
                    bgcolor: roomId.trim() ? '#00ff9f' : 'rgba(255, 255, 255, 0.1)',
                    color: roomId.trim() ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#00ff9f',
                      color: '#000000',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Features */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
              width: '100%',
              maxWidth: 1000,
            }}>
              {[
                {
                  icon: <RocketLaunchIcon sx={{ fontSize: '3rem', color: '#00ff9f', filter: 'drop-shadow(0 0 10px rgba(0, 255, 159, 0.5))' }} />,
                  title: 'Instant Setup',
                  description: 'No registration required. Create a workspace and start coding in seconds.',
                  delay: 0.6,
                },
                {
                  icon: <CodeIcon sx={{ fontSize: '3rem', color: '#00ff9f', filter: 'drop-shadow(0 0 10px rgba(0, 255, 159, 0.5))' }} />,
                  title: 'Multi-Language Support',
                  description: 'Code in JavaScript, Python, Java, C++, and more with syntax highlighting.',
                  delay: 0.8,
                },
                {
                  icon: <GroupsIcon sx={{ fontSize: '3rem', color: '#00ff9f', filter: 'drop-shadow(0 0 10px rgba(0, 255, 159, 0.5))' }} />,
                  title: 'Real-time Collaboration',
                  description: 'Code together with your team in perfect synchronization.',
                  delay: 1,
                },
              ].map((feature, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    textAlign: 'center',
                    p: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 159, 0.1)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${feature.delay}s`,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 159, 0.1)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0, 255, 159, 0.2)',
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" sx={{ 
                    mb: 1,
                    mt: 2,
                    color: '#00ff9f',
                    fontWeight: 'bold',
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {feature.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            mt: 'auto',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography variant="body2" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            textShadow: '0 0 10px rgba(0, 255, 159, 0.3)',
          }}>
            DevSync — Where Code Comes Together • Built by{' '}
            <Button
              href="https://github.com/shanti-jangam"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#00ff9f',
                p: 0,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Shanti Jangam
            </Button>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home; 