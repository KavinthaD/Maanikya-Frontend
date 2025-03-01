import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      return 'http://localhost:5000'; // Android emulator
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // iOS simulator
    } else {
      // Physical device - use your computer's local IP address
      return 'local-ip-address-here:5000';
    }
  }
  // Production environment
  return 'https://your-production-api.com';
};

export const API_URL = getBaseUrl();
export const ENDPOINTS = {
  REGISTER_GEM: '/api/gems/register',
  GEMS: '/api/gems'
  // Add other endpoints here
};