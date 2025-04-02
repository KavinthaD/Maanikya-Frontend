import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationToast from '../components/NotificationToast';

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Show a notification
  const showNotification = useCallback((notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  }, []);
  
  // Hide a notification
  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }, []);
  
  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          title={notification.title}
          body={notification.body}
          onPress={() => {
            if (notification.onPress) notification.onPress();
            hideNotification(notification.id);
          }}
          onClose={() => hideNotification(notification.id)}
          autoClose={notification.autoClose !== false}
        />
      ))}
    </NotificationContext.Provider>
  );
};