// Purpose: Test individual components/screens of the app.

import React from "react";
import { StyleSheet, SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BS_NavBar from "./src/components/BS_NavBar";

// Import all screens
// import Alerts from "./src/screens/Alerts";
// import AlertsScreen from "./src/screens/AlertsScreen";
// import BurnerFinancialRecords from "./src/screens/BurnerFinancialRecords";
// import BusinessOwnerEditProfile from "./src/screens/BusinessOwnerEditProfile";
// import BusinessOwnerProfile from "./src/screens/BusinessOwnerProfile";
// import BusinessOwnerProfilePhoto from "./src/screens/BusinessOwnerProfilePhoto";
// import CompletedTracker from "./src/screens/CompletedTracker";
// import ConnectedUsers from "./src/screens/ConnectedUsers";
// import ConnectScreen from "./src/screens/ConnectScreen";
// import Customeraddseller from "./src/screens/Customeraddseller";
// import CustomerProfile from "./src/screens/CustomerProfile";
// import CutterFinancialRecords from "./src/screens/CutterFinancialRecords";
// import CutterHomePage from "./src/screens/CutterHomePage";
// import GemCertificateAdd from "./src/screens/GemCertificateAdd";
// import GemOnDisplay from "./src/screens/GemOnDisplay";
// import GemRegister1 from "./src/screens/GemRegister1";
// import GemRegister2 from "./src/screens/GemRegister2";
// import HomeMyGems from "./src/screens/HomeMyGems";
// import HomeScreen from "./src/screens/HomeScreen";
// import InProgressTracker from "./src/screens/InProgressTracker";
// import Login from "./src/screens/Login";
// import Market from "./src/screens/Market";
// import MyGems from "./src/screens/MyGems";
// import OngoingTracker from "./src/screens/OngoingTracker";
// import Orders from "./src/screens/Orders";
// import OwnerFinancialRecords from "./src/screens/ownerFinancialRecords";
// import OwnerOrderTrackDetails from "./src/screens/OwnerOrderTrackDetails";
// import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
// import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
// import SignUpScreenCustomer from "./src/screens/SignUpScreenCustomer";
// import Tracker from "./src/screens/Tracker";
// import WelcomePage from "./src/screens/WelcomePage";
// import WorkerOrderTrackDetails from "./src/screens/WorkerOrderTrackDetails";
// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "./src/screens/Favorites";
import HomeScreen from "./src/screens/HomeScreen";
import { baseScreenStyles } from "./src/styles/baseStyles";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ 
        flex: 1,
        backgroundColor: baseScreenStyles.backgroundColor.backgroundColor,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
      }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={baseScreenStyles.backgroundColor.backgroundColor}
          translucent={true}
        />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="GemRegister1">
            <Stack.Screen 
              name="GemRegister1" 
              options={{
                headerShown: false,
              }} 
              component={GemRegister1} 
            />
            <Stack.Screen 
              name="GemRegister2" 
              component={GemRegister2} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
