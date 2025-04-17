import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface CodeExecutionProps {
  code: string;
  language: string;
}

const CodeExecution: React.FC<CodeExecutionProps> = ({ code, language }) => {
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCode = async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      // Prepare the code for execution
      const wrappedCode = language === 'javascript' ? `
        try {
          const logs = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          };
          
          ${code}
          
          console.log = originalLog;
          return logs.join('\\n');
        } catch (error) {
          return 'Error: ' + error.message;
        }
      ` : code;

      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: wrappedCode,
          language 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute code');
      }

      if (data.output === undefined || data.output === null) {
        setOutput('No output');
      } else {
        setOutput(data.output.trim() || 'No output');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      gap: 2,
    }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Button
          variant="contained"
          onClick={executeCode}
          disabled={isLoading || !code.trim()}
          startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          sx={{
            bgcolor: '#00ff9f',
            color: '#000',
            '&:hover': {
              bgcolor: '#00cc7f',
            },
            '&:disabled': {
              bgcolor: 'rgba(0, 255, 159, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {isLoading ? 'Executing...' : 'Run Code'}
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 1,
          overflow: 'auto',
          p: 2,
          fontFamily: 'JetBrains Mono, monospace',
          position: 'relative',
          border: '1px solid rgba(0, 255, 159, 0.1)',
        }}
      >
        {output || error ? (
          <Box sx={{ color: error ? 'error.main' : '#fff' }}>
            <Typography
              component="pre"
              sx={{
                m: 0,
                p: 0,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error ? `Error: ${error}` : output}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            Click "Run Code" to execute the code
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CodeExecution; 