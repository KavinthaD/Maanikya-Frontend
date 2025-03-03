import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { baseScreenStyles } from "./src/styles/baseStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

//import screens
import PurposeSelectionPage from "./src/screens/Auth/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/Auth/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import HomePageWorker from "./src/screens/Home/HomePageWorker";
import HomePageBusiness from "./src/screens/Home/HomePageBusiness";
import SignUpScreenCustomer from "./src/screens/Auth/SignUpCustomer";
import GemstoneMarketplace from "./src/screens/Market";
import OwnerFinancialRecords from "./src/screens/Financial/ownerFinancialRecords";
import ConnectScreen from "./src/screens/ConnectScreen";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import ProfileScreen from "./src/screens/ConnectedUsers";
import FavoritesScreen from "./src/screens/Favorites";
import OrderScreen from "./src/screens/Order/Orders";
import Login from "./src/screens/Auth/Login";
import SignUpBusiness from "./src/screens/Auth/SignUpBusiness";
import SignUpBusiness2 from "./src/screens/Auth/SignUpBusiness2";
import HomeMyGems from "./src/screens/GemProfile/HomeMyGems";
import BS_NavBar from "./src/components/BS_NavBar";
import C_NavBar from "./src/components/C_NavBar";
import W_NavBar from "./src/components/W_NavBar";
import GemRegister1 from "./src/screens/GemProfile/GemRegister1";
import Tracker from "./src/screens/Order/Tracker"
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import HomePageCustomer from "./src/screens/Home/HomePageCustomer";
import InProgressTrackerScreen from "./src/screens/Order/InProgressTracker";
import CompletedTrackerScreen from "./src/screens/Order/CompletedTracker";
import Customeraddseller from "./src/screens/Customeraddseller"

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState('WelcomePage'); // Default to WelcomePage initially

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("checkLoginStatus: Starting..."); // Debug log at start
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        console.log("checkLoginStatus: Retrieved authToken from AsyncStorage:", authToken); // Log authToken value

        if (authToken) {
          console.log("checkLoginStatus: authToken found - User likely logged in");
          // **IMPORTANT: Replace 'HomePageBusiness' with the correct logic based on user role**
          setInitialRouteName('HomePageBusiness'); // Placeholder - adjust this based on role
          console.log("checkLoginStatus: initialRouteName set to HomePageBusiness (placeholder)");
        } else {
          console.log("checkLoginStatus: No authToken found - User not logged in");
          setInitialRouteName('WelcomePage'); // Or 'Login' - you can change to 'Login' if you prefer to start at login screen
          console.log("checkLoginStatus: initialRouteName set to WelcomePage");
        }
      } catch (error) {
        console.error("checkLoginStatus: Error checking login status:", error);
        setInitialRouteName('WelcomePage'); // Fallback
        console.log("checkLoginStatus: Error occurred, initialRouteName set to WelcomePage (fallback)");
      }
      console.log("checkLoginStatus: Final initialRouteName:", initialRouteName); // Log final initialRouteName before navigation
      console.log("checkLoginStatus: Ending."); // Debug log at end
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: baseScreenStyles.backgroundColor.backgroundColor,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={baseScreenStyles.backgroundColor.backgroundColor}
          translucent={true}
        />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen
              name="WelcomePage"
              component={WelcomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PurposeSelectionPage"
              component={PurposeSelectionPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterSelectionPage"
              component={RegisterSelectionPage}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUpBusiness"
              component={SignUpBusiness}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="SignUpScreen"
              component={SignUpBusiness2}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SignUpScreenCustomer"
              component={SignUpScreenCustomer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomePageBusiness"
              component={HomePageBusiness}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomePageWorker"
              component={HomePageWorker}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="C_NavBar"
              component={C_NavBar}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomePageCustomer"
              component={HomePageCustomer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GemstoneMarketplace"
              component={ GemstoneMarketplace}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OwnerFinancialRecords"
              component={OwnerFinancialRecords}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ConnectScreen"
              component={ConnectScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GemOnDisplay"
              component={GemOnDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FavoritesScreen "
              component={FavoritesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderScreen"
              component={OrderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeMyGems"
              component={HomeMyGems}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BS_NavBar"
              component={BS_NavBar}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="W_NavBar"
              component={W_NavBar}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="GemRegister1"
              component={GemRegister1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Tracker"
              component={Tracker}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BusinessOwnerProfile"
              component={BusinessOwnerProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Customeraddseller"
              component={Customeraddseller}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InProgressTrackerScreen"
              component={InProgressTrackerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CompletedTrackerScreen"
              component={CompletedTrackerScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;