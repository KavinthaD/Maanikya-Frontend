import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Notification types with their icons
const NOTIFICATION_TYPES = {
  message: { name: 'chatbubble', color: '#1E88E5' },
  order: { name: 'cube', color: '#43A047' },
  system: { name: 'information-circle', color: '#FB8C00' },
  payment: { name: 'cash', color: '#8E24AA' },
  alert: { name: 'alert-circle', color: '#E53935' },
};

const InAppNotificationItem = ({ 
  notification, 
  onPress, 
  showTime = true,
  isUnread = false 
}) => {
  const { title, body, createdAt, type = 'system' } = notification;
  
  // Get notification icon based on type
  const notificationIcon = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.system;
  
  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isUnread && styles.unreadContainer]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${notificationIcon.color}20` }]}>
        <Ionicons name={notificationIcon.name} size={24} color={notificationIcon.color} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {showTime && <Text style={styles.time}>{formatTime(createdAt)}</Text>}
        </View>
        
        <Text style={styles.body} numberOfLines={2}>{body}</Text>
      </View>
      
      {isUnread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: '#f0f7ff',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  body: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E88E5',
    position: 'absolute',
    top: 12,
    right: 12,
  }
});

export default InAppNotificationItem;