import { Platform } from "react-native";

const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === "android") {
      return "http://192.168.1.2:5000"; // Primary IP
      // andorid emulator ip : 10.0.2.2
    } else if (Platform.OS === "ios") {
      return "http://localhost:5000"; // iOS simulator
    } else {
      // Physical device - use your computer's local IP address
      return "local-ip-address-here:5000";
    }
  }
  // Production environment
  return "https://maanikya-backend.onrender.com";
};

export const API_URL = getBaseUrl();
export const ENDPOINTS = {
  REGISTER_GEM: "/api/gems/register",
  GEMS: "/api/gems",
  AI_ANALYZE: "/api/ai/analyze",
  REGISTER_USER: "/api/auth/register",
  REGISTER_CUSTOMER: "/api/auth/register-step2",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  GET_USER_PROFILE: "/api/userProfile/me",
  UPDATE_PROFILE: "/api/userProfile/update-profile",
  GET_MY_GEMS: "/api/gems/my-gems",

  ADD_GEMS_TO_MARKET: "/api/market/add",
  GET_GEMS_ON_MARKET: "/api/market/view",
  GET_MY_MARKET_GEMS: "/api/gems/view/market-gems",
  REMOVE_GEM_FROM_MARKET: "/api/market/remove",

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
  SEND_ORDER: "/api/owner/orders",
  
  // Order endpoints
  ORDERS:"/api/orders",
  CREATE_ORDER: "/api/orders", // For creating new orders
  GET_ORDERS_OWNER: "/api/orders/owner-view",   // For fetching orders
  GET_ORDERS_WORKER: "/api/orders/worker-view",   // For fetching orders
  UPDATE_ORDER: "/api/orders", // For updating order status
  UPDATE_ORDER_STATUS: "/api/orders/worker", // This will be used with /:id/status
  
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  // Add other endpoints here

  // Push notification endpoints
  PUSH_TOKEN: "/api/push-token",
};