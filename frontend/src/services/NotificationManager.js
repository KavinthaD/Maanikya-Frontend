import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification component
const NotificationToast = ({ notification, onPress, onClose }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  // Set up icon and color based on notification type
  const notificationType = notification.data?.notificationType || 'system';
  
  const iconMap = {
    'order': 'cube',
    'message': 'chatbubble',
    'alert': 'alert-circle',
    'system': 'information-circle',
    'payment': 'cash'
  };
  
  const colorMap = {
    'order': '#43A047',
    'message': '#1E88E5',
    'alert': '#E53935',
    'system': '#FB8C00',
    'payment': '#8E24AA'
  };
  
  const icon = iconMap[notificationType] || 'information-circle';
  const color = colorMap[notificationType] || '#FB8C00';
  
  React.useEffect(() => {
    // Fade in
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Animated.View style={[styles.notification, { opacity: animatedValue }]}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.body}>{notification.body}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = { id, ...notification };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after timeout if autoClose is true
    if (notification.autoClose !== false) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(item => item.id !== id));
      }, 3500); // Slightly longer than component's own timeout
    }
    
    return id;
  }, []);
  
  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const value = { showNotification, hideNotification, notifications };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <View style={styles.container}>
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onPress={() => {
              if (notification.onPress) notification.onPress();
              hideNotification(notification.id);
            }}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Ensure it's below the status bar
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  notification: {
    margin: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  closeButton: {
    padding: 6,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#999',
  },
});

export default NotificationProvider;