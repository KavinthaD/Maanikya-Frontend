// Purpose: Test individual components/screens of the app.

import React from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// Import all screens
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { baseScreenStyles } from "./src/styles/baseStyles";
import BusinessOwnerProfile from "./src/screens/UserProfile/BusinessOwnerProfile";
import BusinessOwnerEditProfile from "./src/screens/UserProfile/BusinessOwnerEditProfile";

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
              name="BusinessOwnerProfile"
              component={BusinessOwnerProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BusinessOwnerEditProfile"
              component={BusinessOwnerEditProfile}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}