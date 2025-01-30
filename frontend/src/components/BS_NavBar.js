import { Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Gem_lot_register_2 from "../screens/GemLotRegister2";
import AddGems from "../screens/AddGems";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();
// Dummy Screens
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text>Home Screen</Text>
  </View>
);

const MarketScreen = () => (
  <View style={styles.screen}>
    <Text>Market Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text>Profile Screen</Text>
  </View>
);

const AddGem = () => (
  <View style={styles.screen}>
    <Text>Addgem Screen</Text>
  </View>
);

const Alerts = () => (
  <View style={styles.screen}>
    <Text>Alerts Screen</Text>
  </View>
);
export default function BS_NavBar({navigation}){
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            let iconSource;
            let iconWidth = 30; // Default icon width
            let iconHeight = size; // Default icon height (using size prop)
            if (route.name === "Home") {
              iconSource = require("../assets/navbar-icons/home.png");
            } else if (route.name === "Market") {
              iconSource = require("../assets/navbar-icons/market.png");
            } else if (route.name === "Add") {
              iconSource = require("../assets/navbar-icons/addgem.png");
              iconWidth = 35; // Make AddGem icon wider (adjust as needed)
              iconHeight = 35; // Make AddGem icon taller (adjust as needed)
            } else if (route.name === "Alerts") {
              iconSource = require("../assets/navbar-icons/alerts.png");
            } else if (route.name === "Profile") {
              iconSource = require("../assets/navbar-icons/profile.png");
            }
            // Return Image component with the correct source and styling
            return (
              <Image
                source={iconSource}
                style={{
                  width: iconWidth, // Use the conditionally set width
                  height: iconHeight, // Use the conditionally set height
                  tintColor: color, // This allows you to change the icon color
                }}
              />
            );
          },
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#aaa",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false, // This hides the header for the Home screen
          }}
        />
        <Tab.Screen
          name="Market"
          component={MarketScreen}
          options={{
            headerShown: false, // Optional: to hide header for Market screen as well
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddGems}
          options={{
            headerShown: false, // Optional: to hide header for Profile screen as well
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={{
            headerShown: false, // Optional: to hide header for Profile screen as well
          }}
        />
        <Tab.Screen
          name="Profile"
          component={AddGem}
          options={{
            headerShown: false, // Optional: to hide header for Profile screen as well
          }}
        />
      </Tab.Navigator>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    backgroundColor: "#072D44",
    height: 80,
    position: "absolute",
    overflow: "hidden",
    paddingTop: 5,
  },
});

