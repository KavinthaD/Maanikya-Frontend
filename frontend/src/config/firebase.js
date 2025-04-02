import { initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// Firebase configuration object from your firebase console
const firebaseConfig = {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const initFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
};

export { initFirebase };