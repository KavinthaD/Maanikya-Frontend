import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastError, setLastError] = useState(null);
  const [hasToken, setHasToken] = useState(false);

  // Check if token exists - don't connect yet
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setHasToken(!!token);
    };
    
    // Check initially
    checkToken();
    
    // Set up periodic checks (every 2 seconds)
    // This is a workaround since AsyncStorage doesn't support event listeners
    const intervalId = setInterval(checkToken, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Connect to WebSocket server only when we have a token
  const connectSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping socket connection');
        setIsConnected(false);
        return;
      }

      // Extract the base URL from API_URL
      const baseUrl = API_URL.replace('/api', '');
      console.log('Connecting to socket server at:', baseUrl);

      // Create socket instance
      const socketInstance = io(baseUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Set up event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected! Socket ID:', socketInstance.id);
        // Send authentication after connection
        console.log('Sending authentication token...');
        socketInstance.emit('authenticate', token);
      });

      socketInstance.on('authenticated', (data) => {
        console.log('Socket authenticated successfully:', data);
        setIsConnected(true);
        setLastError(null);
      });

      socketInstance.on('auth_error', (error) => {
        console.error('Socket authentication error:', error);
        setIsConnected(false);
        setLastError(`Auth error: ${error.message}`);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setIsConnected(false);
        setLastError(`Connection error: ${error.message}`);
      });

      socketInstance.on('message-notification', (data) => {
        console.log('New message notification:', data);
        setNotifications(prev => [...prev, data]);
        setUnreadCount(prev => prev + 1);
      });

      socketInstance.on('new-message', (data) => {
        console.log('New message received globally:', data);
        // Store notification for updating conversation list
        setNotifications(prev => [...prev, data]);
      });

      setSocket(socketInstance);
      
      return () => {
        console.log('Disconnecting socket');
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error('Error setting up websocket:', error);
      setLastError(`Setup error: ${error.message}`);
    }
  };

  // Connect when token becomes available
  useEffect(() => {
    if (hasToken) {
      connectSocket();
    } else if (socket) {
      // Disconnect if token is removed
      socket.disconnect();
      setSocket(null);
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [hasToken]);

  // Provide reconnection method
  const reconnect = async () => {
    console.log('Attempting to reconnect socket...');
    
    // Force a token check first
    const token = await AsyncStorage.getItem('authToken');
    setHasToken(!!token);
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    if (token) {
      await connectSocket();
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    reconnect,
    clearNotifications,
    lastError
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};