import React from "react";
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
              name="SignUpBusiness"
              component={SignUpBusiness}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUpScreen}
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
              component={GemstoneMarketplace}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeMyGems"
              component={GemCollectionScreen}
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
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
