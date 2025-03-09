import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      
        return 'http://10.0.2.2:5000'; // Primary IP
      
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
  GEMS: '/api/gems',
  AI_ANALYZE: '/api/ai/analyze',
  REGISTER_STEP1: '/api/auth/register-step1',
  REGISTER_STEP2: '/api/auth/register-step2',
  REGISTER_CUSTOMER: '/api/auth/register-step2',
  LOGIN: '/api/auth/login',
  GET_USER_PROFILE: '/api/auth/me',
  UPDATE_PROFILE: '/api/auth/update-profile',
  // Add other endpoints here
};