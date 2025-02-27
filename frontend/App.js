import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreenCustomer from "./src/screens/SignUpScreenCustomer";
import CustomHomePage from "./src/screens/CustomHomePage";
import GemstoneMarketplace from "./src/screens/Market";
import GemCollectionScreen from "./src/screens/HomeMyGems";
import OwnerFinancialRecords from "./src/screens/ownerFinancialRecords";
import ConnectScreen from "./src/screens/ConnectScreen";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import ProfileScreen from "./src/screens/ConnectedUsers";
import FavoritesScreen from "./src/screens/Favorites";
import OrderScreen from "./src/screens/Orders";
import Login from "./src/screens/Login";
import BusinessSignIn1 from "./src/screens/BusinessSignIn1";
import SignUpScreen from "./src/screens/SignUpScreen";
import MySellersScreen from "./src/screens/Customeraddseller";

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
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusinessSignIn1"
          component={ BusinessSignIn1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={ SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreenCustomer"
          component={SignUpScreenCustomer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MySellersScreen"
          component={MySellersScreen}
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
          name="GemstoneMarketplace"
          component={ GemstoneMarketplace }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeMyGems"
          component={ GemCollectionScreen }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OwnerFinancialRecords"
          component={ OwnerFinancialRecords }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConnectScreen"
          component={ ConnectScreen }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GemOnDisplay"
          component={ GemOnDisplay }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ ProfileScreen }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FavoritesScreen "
          component={ FavoritesScreen }
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderScreen"
          component={ OrderScreen }
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 

