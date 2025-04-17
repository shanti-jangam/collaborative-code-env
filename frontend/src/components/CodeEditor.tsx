import React, { useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import socket from '../services/socket';

interface CodeEditorProps {
  roomId: string;
  language?: string;
  theme?: string;
  onCodeChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  roomId,
  language = 'javascript',
  theme = 'vs-dark',
  onCodeChange,
}) => {
  const [code, setCode] = React.useState<string>('');
  const isTyping = useRef(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // Handle editor layout updates
  const updateEditorLayout = useCallback(() => {
    if (editorRef.current) {
      requestAnimationFrame(() => {
        editorRef.current.layout();
      });
    }
  }, []);

  useEffect(() => {
    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for code changes from other users
    const handleCodeChange = (newCode: string) => {
      if (!isTyping.current) {
        setCode(newCode);
        if (onCodeChange) {
          onCodeChange(newCode);
        }
      }
    };

    socket.on('code-change', handleCodeChange);

    return () => {
      socket.off('code-change', handleCodeChange);
    };
  }, [roomId, onCodeChange]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      isTyping.current = true;
      setCode(value);
      if (onCodeChange) {
        onCodeChange(value);
      }
      socket.emit('code-change', { roomId, code: value });
      setTimeout(() => {
        isTyping.current = false;
      }, 500);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up ResizeObserver for the container
    if (containerRef.current && !resizeObserver.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to throttle resize events
        requestAnimationFrame(() => {
          for (const entry of entries) {
            if (entry.target === containerRef.current) {
              updateEditorLayout();
            }
          }
        });
      });
      
      resizeObserver.current.observe(containerRef.current);
    }

    // Initial layout update
    updateEditorLayout();
  };

  // Clean up ResizeObserver
  useEffect(() => {
    return () => {
      if (resizeObserver.current && containerRef.current) {
        resizeObserver.current.unobserve(containerRef.current);
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          p: 1.5,
          bgcolor: 'rgba(29, 29, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 255, 159, 0.1)',
          color: '#00ff9f',
          fontSize: '0.85rem',
          fontFamily: 'JetBrains Mono',
        }}
      >
        Room: {roomId}
      </Typography>
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        '& .monaco-editor': {
          paddingTop: 1,
        },
        '& .monaco-editor .margin': {
          backgroundColor: 'transparent',
        },
      }}>
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            cursorStyle: 'line',
            fixedOverflowWidgets: true,
            padding: { top: 8 },
            renderLineHighlight: 'all',
            fontFamily: 'JetBrains Mono',
            fontLigatures: true,
          }}
          loading={
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              color: '#00ff9f',
              fontFamily: 'JetBrains Mono',
            }}>
              Loading editor...
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default CodeEditor; 