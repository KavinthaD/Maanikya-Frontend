import React from "react";
import { SafeAreaView, StatusBar, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import FavoritesScreen from "./src/screens/Favorites";
import HomeScreen from "./src/screens/Home/HomePageBusiness";
import CustomHomePage from "./src/screens/Home/HomePageCustomer";
//import HomePageBusiness from "./src/screens/Home/HomePageBusiness";
import GemRegister1 from "./src/screens/GemProfile/GemRegister1";
import GemRegister2 from "./src/screens/GemProfile/GemRegister2";
import HomeMyGems from "./src/screens/GemProfile/HomeMyGems";
import ConnectScreen from "./src/screens/ConnectScreen";
import ConnectedUser from "./src/screens/ConnectedUsers";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import Market from "./src/screens/GemOnDisplay";
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import Login from "./src/screens/Auth/Login";
import AlertsScreen from "./src/screens/Notification/Alerts";
import WorkerOrderTrackDetails from "./src/screens/Order/WorkerOrderTrackDetails";
import WelcomePage from "./src/screens/WelcomePage";
import PurposeSelectionPage from "./src/screens/Auth/PurposeSelectionPage";
import OwnerOrderTrackDetails from "./src/screens/Order/OwnerOrderTrackDetails";
import SellerProfile from "./src/screens/MySellerFullProfile";
import { baseScreenStyles } from "./src/styles/baseStyles";
import Tracker from "./src/screens/Order/Tracker";
import CompletedTracker from "./src/screens/Order/CompletedTracker";
import OngoingTracker from "./src/screens/Order/OngoingTracker";
import OrderScreen from "./src/screens/Order/Orders";
import InProgressTrackerScreen from "./src/screens/Order/InProgressTracker";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'black',
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={baseScreenStyles.container.backgroundColor}
          translucent={true}
        />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="WelcomePage"
              options={{
                headerShown: false,
              }}
              component={AlertsScreen}
            />
           
            {/* Add other screens here */}
          </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}