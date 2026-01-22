// app/hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message } from '../types';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We use a ref to track the current AI message being built during streaming
  const currentAiMessageId = useRef<string | null>(null);

  useEffect(() => {
    // Initialize Socket connection
    // const socketInstance = io(); // Connects to the same host/port

    // New code
const socketInstance = io("http://localhost:3000", {
  path: "/socket.io",
  transports: ["websocket"], // Force WebSocket to avoid polling errors
  addTrailingSlash: false,
});

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', () => {
      setError('Connection failed. Retrying...');
      setIsConnected(false);
    });

    // Handle Incoming Stream Chunks
    socketInstance.on('ai-stream-chunk', (chunk: string) => {
      setIsTyping(false); // Valid response started, stop "thinking" indicator
      
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        
        // If the last message is already the AI's current stream, append to it
        if (lastMsg && lastMsg.id === currentAiMessageId.current) {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, content: lastMsg.content + chunk }
          ];
        } 
        // Otherwise, start a new AI message block
        else {
           // We shouldn't really hit this else if logic is tight, 
           // but it's a safety net for the first chunk.
           return prev; 
        }
      });
    });

    socketInstance.on('ai-typing-start', () => {
       setIsTyping(true);
       const newId = Date.now().toString();
       currentAiMessageId.current = newId;
       
       // Initialize an empty AI message
       setMessages(prev => [
         ...prev, 
         { 
           id: newId, 
           role: 'ai', 
           content: '', 
           timestamp: new Date() 
         }
       ]);
    });

    socketInstance.on('ai-stream-complete', () => {
      setIsTyping(false);
      currentAiMessageId.current = null;
    });

    socketInstance.on('error', (errMsg: string) => {
      setError(errMsg);
      setIsTyping(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (content: string) => {
    if (!socket) return;
    
    // Optimistically add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    socket.emit('chat-message', content);
  };

  const clearChat = () => setMessages([]);

  return { socket, isConnected, messages, sendMessage, isTyping, error, clearChat };
};