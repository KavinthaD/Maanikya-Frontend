import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NotificationToast = ({ title, body, onPress, onClose, autoClose = true }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  
  useEffect(() => {
    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8
    }).start();
    
    // Auto close after 3 seconds if enabled
    let timeout;
    if (autoClose) {
      timeout = setTimeout(() => {
        handleClose();
      }, 3000);
    }
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (onClose) onClose();
    });
  };
  
  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity 
        style={styles.content} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="#082f4f" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.body} numberOfLines={2}>{body}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={16} color="#666" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    marginTop: 40, // Adjust based on your status bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  body: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },
  closeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default NotificationToast;