import React, { useEffect, useState, useCallback } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '../config/api';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNotification } from './NotificationManager';

// Create notification channels for Android
const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    // Import the specific function
    const { createChannel } = messaging().android;
    
    // Create the channel
    await createChannel({
      id: 'default_channel_id',
      name: 'Default Channel',
      description: 'Default notification channel',
      sound: 'default',
      importance: 4, // High importance
      vibration: true
    });

    console.log('Notification channel created for Android');
  }
};

// Request push notification permissions
export const requestUserPermission = async () => {
  try {
    // Create channel for Android
    await createNotificationChannel();
    
    const authStatus = await messaging().requestPermission();
    const enabled = 
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if (enabled) {
      console.log('Push notification permission granted');
      return true;
    }
    console.log('Push notification permission denied');
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get FCM token
export const getFCMToken = async () => {
  try {
    // Get the token from Firebase
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    
    // Save the token to AsyncStorage
    await AsyncStorage.setItem('fcmToken', token);
    
    // Send the token to your backend
    await sendTokenToServer(token);
    
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Send token to your backend
const sendTokenToServer = async (token) => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    
    if (!authToken) {
      console.log('User not logged in, cannot register token');
      return false;
    }
    
    const response = await axios.post(
      `${API_URL}${ENDPOINTS.PUSH_TOKEN}/register`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Token registered with server:', response.data);
    return true;
  } catch (error) {
    console.error('Error registering token with server:', error);
    return false;
  }
};

// Set up notification listeners
export const setupNotificationListeners = (navigationCallback, notificationCallback) => {
  // Handle notification opened from background state
  const backgroundSub = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened from background state:', remoteMessage);
    
    const { data } = remoteMessage;
    if (data && data.clickAction) {
      navigationCallback(data.clickAction, {
        id: data.relatedId || null,
        alertId: data.alertId || null,
        orderId: data.orderId || null
      });
    }
  });
  
  // Handle notification when app is closed/killed
  messaging().getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification opened from quit state:', remoteMessage);
        
        const { data } = remoteMessage;
        if (data && data.clickAction) {
          navigationCallback(data.clickAction, {
            id: data.relatedId || null,
            alertId: data.alertId || null,
            orderId: data.orderId || null
          });
        }
      }
    })
    .catch(error => console.error('Error getting initial notification:', error));
  
  // Handle foreground notifications
  const foregroundSub = messaging().onMessage(async remoteMessage => {
    console.log('Notification received in foreground:', remoteMessage);
    
    if (notificationCallback) {
      // Pass all useful data to the notification callback
      const title = remoteMessage.notification?.title || 'New notification';
      const body = remoteMessage.notification?.body || '';
      
      // Include notification type for custom styling
      const notificationType = remoteMessage.data?.notificationType || 'system';
      
      notificationCallback(
        title,
        body,
        {
          ...remoteMessage.data,
          notificationType,
          timestamp: remoteMessage.sentTime,
        }
      );
    }
  });
  
  // Set up background message handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background:', remoteMessage);
    return Promise.resolve();
  });
  
  // Return cleanup function
  return () => {
    backgroundSub && typeof backgroundSub === 'function' && backgroundSub();
    foregroundSub && typeof foregroundSub === 'function' && foregroundSub();
  };
};

// Export a hook for using push notifications with the notification manager
export const usePushNotifications = (navigation) => {
  // Use the notification context
  const { showNotification } = useNotification();
  
  // Set up a state to track initialization
  const [initialized, setInitialized] = useState(false);
  
  // Initialize permissions and token on mount
  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        await getFCMToken();
        setInitialized(true);
      }
    };
    
    initialize();
  }, []);
  
  // Set up listeners specifically for the component using this hook
  useEffect(() => {
    if (!initialized) return;
    
    const unsubscribe = setupNotificationListeners(
      (screenName, params) => {
        if (navigation) {
          navigation.navigate(screenName, params);
        }
      },
      (title, body, data) => {
        showNotification({
          title,
          body,
          data,
          onPress: () => {
            if (data.clickAction) {
              navigation.navigate(data.clickAction, {
                id: data.relatedId || null,
                alertId: data.alertId || null,
                orderId: data.orderId || null
              });
            }
          }
        });
      }
    );
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigation, showNotification, initialized]);
  
  // Function to send a test notification
  const sendTestNotification = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication required for testing notifications');
        return false;
      }

      // Get the current FCM token
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      if (!fcmToken) {
        console.error('FCM token not found');
        return false;
      }

      console.log('Sending test notification request...');
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.PUSH_TOKEN}/test`,
        { token: fcmToken }, // Include token in the request
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Test notification response:', response.data);
      return true;
    } catch (error) {
      console.error('Error testing notification:', error.response?.data || error.message);
      return false;
    }
  };
  
  // Return methods to control push notifications
  return {
    sendTestNotification,
  };
};

// Initialize notifications without requiring navigation
export const initializeNotifications = async (navigationCallback) => {
  const hasPermission = await requestUserPermission();
  if (hasPermission) {
    await getFCMToken();
    
    if (navigationCallback) {
      setupNotificationListeners(navigationCallback);
    }
    return true;
  }
  return false;
};