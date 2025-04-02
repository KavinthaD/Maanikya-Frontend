import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { baseScreenStyles } from "./src/styles/baseStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { NotificationProvider } from './src/services/NotificationManager';

// Import screens
import PurposeSelectionPage from "./src/screens/Auth/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/Auth/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import SignUpScreenCustomer from "./src/screens/Auth/SignUpCustomer";
import GemstoneMarketplace from "./src/screens/Market/Market";
import OwnerFinancialRecords from "./src/screens/Financial/ownerFinancialRecords";
import GemOnDisplay from "./src/screens/Market/GemOnDisplay";
import ContactProfiles from "./src/screens/Contacts/ContactProfiles";
import Orders from "./src/screens/Order/Orders";
import Login from "./src/screens/Auth/Login";
import SignUpBusiness from "./src/screens/Auth/SignUpBusiness";
import SignUpBusiness2 from "./src/screens/Auth/SignUpBusiness2";
import HomeMyGems from "./src/screens/GemProfile/HomeMyGems";
import MyGems from "./src/screens/GemProfile/MyGems";
import BS_NavBar from "./src/components/BS_NavBar";
import C_NavBar from "./src/components/C_NavBar";
import W_NavBar from "./src/components/W_NavBar";
import GemRegister1 from "./src/screens/GemProfile/GemRegister1";
import Tracker from "./src/screens/Order/Tracker";
import BusinessOwnerProfile from "./src/screens/UserProfile/UserProfile";
import FavoritesScreen from "./src/screens/Contacts/Favorites";
import InProgressTrackerScreen from "./src/screens/Order/InProgressTracker";
import Customeraddseller from "./src/screens/Customeraddseller";
import SellerProfile from "./src/screens/MySellerFullProfile";
import BusinessOwnerEditProfile from "./src/screens/UserProfile/EditProfile";
import GemDetailsScreen from "./src/screens/Market/GemDetailsScreen";
import OwnerOrderTrackDetails from "./src/screens/Order/OwnerOrderTrackDetails";
import NotificationScreen from "./src/screens/Order/CompletedTracker";
import WorkerFinancialRecords from "./src/screens/Financial/WorkerFinancialRecords";
import WorkerOrderTrackDetails from "./src/screens/Order/WorkerOrderTrackDetails";
import AddContact from "./src/screens/Contacts/AddContact";
import Contacts from "./src/screens/Contacts/Contacts";
import ChatScreen from "./src/screens/Chat/ChatScreen";
import MessageInbox from "./src/screens/Chat/MessageInbox";
import { initializeNotifications, setupNotificationListeners } from './src/services/pushNotificationService';

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const [routeNameRef, setRouteNameRef] = useState();

  useEffect(() => {
    // Initialize push notifications with a callback for navigation
    const handleNotificationNavigation = (screenName, params) => {
      console.log('Navigation from notification to:', screenName, params);
      
      if (navigationRef.isReady() && screenName) {
        navigationRef.navigate(screenName, params || {});
      }
    };

    // Request permissions and initialize notifications
    const setupNotifications = async () => {
      try {
        // Initialize first without navigation callback
        await initializeNotifications();
        
        // Set up listeners with navigation callback
        const unsubscribe = setupNotificationListeners(handleNotificationNavigation);
        
        // Return cleanup function
        return () => {
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };
    
    setupNotifications();
  }, [navigationRef.isReady()]);
  
  // Lock orientation to portrait and set navigation bar color when the app starts
  useEffect(() => {
    const setupApp = async () => {
  
      // Lock screen orientation
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      
      // Set Android navigation bar color to white
      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync('#FFFFFF');
        await NavigationBar.setButtonStyleAsync('dark');
      }
    };

    setupApp();
  }, []);

  return (
    <NotificationProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          {Platform.OS === 'ios' ? (
            <StatusBar barStyle="dark-content" backgroundColor="white" translucent={true} />
          ) : (
            <ExpoStatusBar style="dark" backgroundColor="white" translucent={true} />
          )}
          
          <NavigationContainer 
            ref={navigationRef}
            onReady={() => {
              setRouteNameRef(navigationRef.getCurrentRoute().name);
            }}
            onStateChange={() => {
              const previousRouteName = routeNameRef;
              const currentRouteName = navigationRef.getCurrentRoute().name;
              
              if (previousRouteName !== currentRouteName) {
                // Track screen view or perform any actions when route changes
                setRouteNameRef(currentRouteName);
              }
            }}
          >
            <Stack.Navigator initialRouteName="Login" // Specify your initial route here
          screenOptions={{
            headerShown: false
          }}>
              <Stack.Screen name="AddContact" component={AddContact} options={{ headerShown: false }} />
              <Stack.Screen name="BS_NavBar" component={BS_NavBar} options={{ headerShown: false }} />
              <Stack.Screen name="BusinessOwnerEditProfile" component={BusinessOwnerEditProfile} options={{ headerShown: false }} />
              <Stack.Screen name="BusinessOwnerProfile" component={BusinessOwnerProfile} options={{ headerShown: false }} />
              <Stack.Screen name="C_NavBar" component={C_NavBar} options={{ headerShown: false }} />
              <Stack.Screen name="CompletedTrackerScreen" component={NotificationScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ContactProfiles" component={ContactProfiles} options={{ headerShown: false }} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Contacts" component={Contacts} options={{ headerShown: false }} />
              <Stack.Screen name="Customeraddseller" component={Customeraddseller} options={{ headerShown: false }} />
              <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="GemDetailsScreen" component={GemDetailsScreen} options={{ headerShown: false}} />
              <Stack.Screen name="GemOnDisplay" component={GemOnDisplay} options={{ headerShown: false }} />
              <Stack.Screen name="GemRegister1" component={GemRegister1} options={{ headerShown: false }} />
              <Stack.Screen name="GemstoneMarketplace" component={GemstoneMarketplace} options={{ headerShown: false }} />
              <Stack.Screen name="HomeMyGems" component={HomeMyGems} options={{ headerShown: false }} />
              <Stack.Screen name="InProgressTrackerScreen" component={InProgressTrackerScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="MyGems" component={MyGems} options={{ headerShown: false }} />
              <Stack.Screen name="MessageInbox" component={MessageInbox} options={{ headerShown: false }} />
              <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
              <Stack.Screen name="OwnerFinancialRecords" component={OwnerFinancialRecords} options={{ headerShown: false }} />
              <Stack.Screen name="OwnerOrderTrackDetails" component={OwnerOrderTrackDetails} options={{ headerShown: false}} />
              <Stack.Screen name="PurposeSelectionPage" component={PurposeSelectionPage} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterSelectionPage" component={RegisterSelectionPage} options={{ headerShown: false }} />
              <Stack.Screen name="SellerProfile" component={SellerProfile} options={{ headerShown: false }} />
              <Stack.Screen name="SignUpBusiness" component={SignUpBusiness} options={{ headerShown: false }} />
              <Stack.Screen name="SignUpScreen" component={SignUpBusiness2} options={{ headerShown: false }} />
              <Stack.Screen name="SignUpScreenCustomer" component={SignUpScreenCustomer} options={{ headerShown: false }} />
              <Stack.Screen name="Tracker" component={Tracker} options={{ headerShown: false }} />
              <Stack.Screen name="W_NavBar" component={W_NavBar} options={{ headerShown: false }} />
              <Stack.Screen name="WelcomePage" component={WelcomePage} options={{ headerShown: false }} />
              <Stack.Screen name="WorkerFinancialRecords" component={WorkerFinancialRecords} options={{ headerShown: false }} />
              <Stack.Screen name="WorkerOrderTrackDetails" component={WorkerOrderTrackDetails} options={{ headerShown: false}} />

            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </NotificationProvider>
  );
};

export default App;
