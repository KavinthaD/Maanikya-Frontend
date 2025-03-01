import React from "react";
import { StyleSheet, View, Text } from "react-native";

import OwnerOrderTrackDetails from "./src/screens/OwnerOrderTrackDetails";
import WorkerOrderTrackDetails from "./src/screens/WorkerOrderTrackDetails";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { baseScreenStyles } from "./src/styles/baseStyles";

//import screens
import PurposeSelectionPage from "./src/screens/Auth/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/Auth/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import HomeScreen from "./src/screens/Home/HomePageBusiness";
import SignUpScreenCustomer from "./src/screens/Auth/SignUpCustomer";
import CustomHomePage from "./src/screens/Home/HomePageCustomer";
import GemstoneMarketplace from "./src/screens/Market";
import GemCollectionScreen from "./src/screens/GemProfile/HomeMyGems";
import OwnerFinancialRecords from "./src/screens/Financial/ownerFinancialRecords";
import ConnectScreen from "./src/screens/ConnectScreen";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import ProfileScreen from "./src/screens/ConnectedUsers";
import FavoritesScreen from "./src/screens/Favorites";
import OrderScreen from "./src/screens/Order/Orders";
import Login from "./src/screens/Auth/Login";
import SignUpBusiness from "./src/screens/Auth/SignUpBusiness";
import SignUpScreen from "./src/screens/Auth/SignUpScreen";
import MySellersScreen from "./src/screens/Customeraddseller";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkerOrderTrackDetails">
        <Stack.Screen
          name="WorkerOrderTrackDetails"
          component={ WorkerOrderTrackDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
