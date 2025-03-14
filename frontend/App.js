import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { baseScreenStyles } from "./src/styles/baseStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";

// Import screens
import PurposeSelectionPage from "./src/screens/Auth/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/Auth/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import SignUpScreenCustomer from "./src/screens/Auth/SignUpCustomer";
import GemstoneMarketplace from "./src/screens/Market";
import OwnerFinancialRecords from "./src/screens/Financial/ownerFinancialRecords";
import ConnectScreen from "./src/screens/ConnectScreen";
import ConnectedUsers from "./src/screens/ConnectedUsers"; // Merged from second App component
import GemOnDisplay from "./src/screens/GemOnDisplay";
import ProfileScreen from "./src/screens/ConnectedUsers";
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
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import BurnerFinancialRecords from "./src/screens/Financial/BurnerFinancialRecords";
import CutterFinancialRecords from "./src/screens/Financial/CutterFinancialRecords";
import FavoritesScreen from "./src/screens/Favorites";
import InProgressTrackerScreen from "./src/screens/Order/InProgressTracker";
import Customeraddseller from "./src/screens/Customeraddseller";
import SellerProfile from "./src/screens/MySellerFullProfile";
import BusinessOwnerEditProfile from "./src/screens/UserProfile/BusinessOwnerEditProfile";
//import GemDetailsScreen from "./src/screens/GemDetailsScreen";
import OwnerOrderTrackDetails from "./src/screens/Order/OwnerOrderTrackDetails";
import NotificationScreen from "./src/screens/Order/CompletedTracker";


const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState("WelcomePage");

  // Lock orientation to portrait when the app starts
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    lockOrientation();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor={baseScreenStyles.container.backgroundColor} translucent={true} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen name="WelcomePage" component={WelcomePage} options={{ headerShown: false }} />
            <Stack.Screen name="PurposeSelectionPage" component={PurposeSelectionPage} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterSelectionPage" component={RegisterSelectionPage} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpBusiness" component={SignUpBusiness} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpBusiness2} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreenCustomer" component={SignUpScreenCustomer} options={{ headerShown: false }} />
            <Stack.Screen name="C_NavBar" component={C_NavBar} options={{ headerShown: false }} />
            <Stack.Screen name="GemstoneMarketplace" component={GemstoneMarketplace} options={{ headerShown: false }} />
            <Stack.Screen name="OwnerFinancialRecords" component={OwnerFinancialRecords} options={{ headerShown: false }} />
            <Stack.Screen name="BurnerFinancialRecords" component={BurnerFinancialRecords} options={{ headerShown: false }} />
            <Stack.Screen name="CutterFinancialRecords" component={CutterFinancialRecords} options={{ headerShown: false }} />
            <Stack.Screen name="ConnectScreen" component={ConnectScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConnectedUsers" component={ConnectedUsers} options={{ headerShown: false }} /> 
            <Stack.Screen name="GemOnDisplay" component={GemOnDisplay} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BusinessOwnerEditProfile" component={BusinessOwnerEditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
            <Stack.Screen name="HomeMyGems" component={HomeMyGems} options={{ headerShown: false }} />
            <Stack.Screen name="MyGems" component={MyGems} options={{ headerShown: false }} />
            <Stack.Screen name="BS_NavBar" component={BS_NavBar} options={{ headerShown: false }} />
            <Stack.Screen name="W_NavBar" component={W_NavBar} options={{ headerShown: false }} />
            <Stack.Screen name="GemRegister1" component={GemRegister1} options={{ headerShown: false }} />
            <Stack.Screen name="Tracker" component={Tracker} options={{ headerShown: false }} />
            <Stack.Screen name="BusinessOwnerProfile" component={BusinessOwnerProfile} options={{ headerShown: false }} />
            <Stack.Screen name="Customeraddseller" component={Customeraddseller} options={{ headerShown: false }} />
            <Stack.Screen name="InProgressTrackerScreen" component={InProgressTrackerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CompletedTrackerScreen" component={NotificationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SellerProfile" component={SellerProfile} options={{ headerShown: false }} />
            {/*<Stack.Screen name="GemDetailsScreen" component={GemDetailsScreen} options={{ headerShown: false}} />*/}
            <Stack.Screen name="OwnerOrderTrackDetails" component={OwnerOrderTrackDetails} options={{ headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
