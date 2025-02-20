import React from "react";
import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login1 from "./src/screens/Login1";
import Login2 from "./src/screens/Login2";
import Login3 from "./src/screens/Login3";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreenCustomer from "./src/screens/SignUpScreenCustomer";
import CustomHomePage from "./src/screens/CustomHomePage";


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomePage">
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
          name="Login1"
          component={Login1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login2"
          component={Login2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login3"
          component={Login3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomHomePage"
          component={CustomHomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreenCustomer"
          component={SignUpScreenCustomer}
          options={{ headerShown: false }}
        />
        
        
        {/* Need to add other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
