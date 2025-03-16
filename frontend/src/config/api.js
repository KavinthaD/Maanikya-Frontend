import { Platform } from "react-native";

const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === "android") {
      return "http://10.0.2.2:5000"; // Primary IP
      // andorid emulator ip : 10.0.2.2
    } else if (Platform.OS === "ios") {
      return "http://localhost:5000"; // iOS simulator
    } else {
      // Physical device - use your computer's local IP address
      return "local-ip-address-here:5000";
    }
  }
  // Production environment
  return "https://your-production-api.com";
};

export const API_URL = getBaseUrl();
export const ENDPOINTS = {
  REGISTER_GEM: "/api/gems/register",
  GEMS: "/api/gems",
  AI_ANALYZE: "/api/ai/analyze",
  REGISTER_USER: "/api/auth/register",
  REGISTER_CUSTOMER: "/api/auth/register-step2",
  LOGIN: "/api/auth/login",
  GET_USER_PROFILE: "/api/auth/me",
  UPDATE_PROFILE: "/api/auth/update-profile",
  GET_MY_GEMS: "/api/gems/my-gems",
  ADD_GEMS_TO_MARKET: "/api/market/add",
  GET_GEMS_ON_MARKET: "/api/market/view",
  GET_MY_MARKET_GEMS: "/api/gems/view/market-gems",
  GET_OWNER_FINANCIAL: "/api/financial/owner/analysis",
  GET_WORKER_FINANCIAL: "/api/financial/worker/analysis",
  ALERTS: "/api/alerts",
  MARK_ALERT_READ: "/api/alerts/read",
  MARK_ALL_ALERTS_READ: "/api/alerts/read-all",
   // contacts endpoints
   GET_CONTACTS: "/api/contacts",
   ADD_CONTACT: "/api/contacts/add",
   REMOVE_CONTACT: "/api/contacts/remove",
   CONTACT_DETAILS: "/api/contacts/details",
   SEARCH_USERS: "/api/contacts/search",
   GET_FAVORITES: '/api/contacts/favorites',
   ADD_FAVORITE: '/api/contacts/favorite',
   REMOVE_FAVORITE: '/api/contacts/favorite',
    // Message endpoints
  GET_CONVERSATIONS: '/api/messages',
  GET_MESSAGES: '/api/messages', // Will append contactId
  SEND_MESSAGE: '/api/messages', // Will append contactId
  GET_UNREAD: '/api/messages/unread',
  GET_BASIC_USER: '/api/userProfile/basic', // Will append userId

  // **ADD THESE NEW ENDPOINTS HERE:**
  OWNER_COMPLETED_ORDERS: "/api/owner/orders/completed",
  OWNER_IN_PROGRESS_ORDERS: "/api/owner/orders/in-progress",

  // Add other endpoints here
};