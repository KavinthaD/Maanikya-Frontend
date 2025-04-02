import React, { useEffect, useState, useCallback } from 'react'; 
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '../config/api';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNotification } from './NotificationManager';

// Request push notification permissions
export const requestUserPermission = async () => {
  try {
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
    const authToken = await AsyncStorage.getItem('authToken'); // Match this with what you use in Login.js
    
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

// Initialize Android notification channel
export const createDefaultNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      // Use the correct API to create a channel
      await messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Handling background message', remoteMessage);
        return Promise.resolve();
      });
      
      console.log('Background message handler set up');
      return true;
    } catch (e) {
      console.error('Error setting up background handler:', e);
      return false;
    }
  }
  return true;
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
        alertId: data.alertId || null
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
            alertId: data.alertId || null
          });
        }
      }
    })
    .catch(error => console.error('Error getting initial notification:', error));
  
  // Handle foreground notifications
  const foregroundSub = messaging().onMessage(async remoteMessage => {
    console.log('Notification received in foreground:', remoteMessage);
    
    if (notificationCallback) {
      notificationCallback(
        remoteMessage.notification?.title || 'New notification',
        remoteMessage.notification?.body || '',
        remoteMessage.data || {}
      );
    } else {
      // Fall back to simple alert if no callback provided
      showForegroundAlert(remoteMessage);
    }
  });
  
  // Return cleanup function
  return () => {
    backgroundSub && typeof backgroundSub === 'function' && backgroundSub();
    foregroundSub && typeof foregroundSub === 'function' && foregroundSub();
  };
};

// Initialize notifications without requiring navigation
export const initializeNotifications = async (navigationCallback) => {
  const hasPermission = await requestUserPermission();
  if (hasPermission) {
    await getFCMToken();
    
    // Create default channel for Android
    await createDefaultNotificationChannel();
    
    if (navigationCallback) {
      setupNotificationListeners(navigationCallback);
    }
    return true;
  }
  return false;
};

// Send test notification (for debugging)
export const sendTestNotification = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authentication required for testing notifications');
        return false;
      }
  
      console.log('Sending test notification request...');
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.PUSH_TOKEN}/test`,
        {},
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
      console.error('Error testing notification:', error);
      return false;
    }
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
          onPress: () => {
            if (data.clickAction) {
              navigation.navigate(data.clickAction, {
                id: data.relatedId || null,
                alertId: data.alertId || null,
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
  
  // Return methods to control push notifications
  return {
    sendTestNotification,
  };
};