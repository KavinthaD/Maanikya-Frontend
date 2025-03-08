import React from "react";
import { SafeAreaView, StatusBar, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import FavoritesScreen from "./src/screens/Favorites";
import HomeScreen from "./src/screens/Home/HomePageBusiness";
import CustomHomePage from "./src/screens/Home/HomePageCustomer";
import HomePageBusiness from "./src/screens/Home/HomePageBusiness";
import GemRegister1 from "./src/screens/GemProfile/GemRegister1";
import GemRegister2 from "./src/screens/GemProfile/GemRegister2";
import HomeMyGems from "./src/screens/GemProfile/HomeMyGems";
import ConnectScreen from "./src/screens/ConnectScreen";
import ConnectedUser from "./src/screens/ConnectedUsers";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import Market from "./src/screens/GemOnDisplay";
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import Login from "./src/screens/Auth/Login";
import AlertsScreen from "./src/screens/Notification/AlertsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#072D44' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#072D44"
          translucent={true}
        />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="AlertsScreen"
              options={{
                headerShown: false,
              }}
              component={AlertsScreen}
            />
            <Stack.Screen
              name="Home"
              options={{
                headerShown: false,
              }}
              component={HomePageBusiness}
            />
            <Stack.Screen
              name="Market"
              options={{
                headerShown: false,
              }}
              component={Market}
            />
            <Stack.Screen
              name="Profile"
              options={{
                headerShown: false,
              }}
              component={BusinessOwnerProfile}
            />
            {/* Add other screens here */}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}