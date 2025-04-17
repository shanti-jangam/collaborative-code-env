import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Home from './components/Home';
import Room from './components/Room';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9f',
    },
    secondary: {
      main: '#00e5ff',
    },
    background: {
      default: '#151515',
      paper: '#1d1d1d',
    },
  },
  typography: {
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
