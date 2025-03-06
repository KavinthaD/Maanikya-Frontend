// Purpose: Test individual components/screens of the app.

import React from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// Import all screens
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "./src/screens/Favorites";
import HomeScreen from "./src/screens/Home/HomePageBusiness";
import { baseScreenStyles } from "./src/styles/baseStyles";
import CustomHomePage from "./src/screens/Home/HomePageCustomer";
import HomePageBusiness from "./src/screens/Home/HomePageBusiness";
import GemRegister1 from "./src/screens/GemProfile/GemRegister1";
import GemRegister2 from "./src/screens/GemProfile/GemRegister2";
import HomeMyGems from "./src/screens/GemProfile/HomeMyGems";
import MyGems from "./src/screens/GemProfile/MyGems";
import BS_NavBar from "./src/components/BS_NavBar";
import C_NavBar from "./src/components/C_NavBar";
import ConnectScreen from "./src/screens/ConnectScreen";
import ConnectedUser from "./src/screens/ConnectedUsers";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import Market from "./src/screens/GemOnDisplay";
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import Login from "./src/screens/Auth/Login";

const Stack = createNativeStackNavigator();

export default function App() {
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
          <Stack.Navigator>
            <Stack.Screen
              name="BS_NavBar"
              options={{
                headerShown: false,
              }}
              component={GemRegister1}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
