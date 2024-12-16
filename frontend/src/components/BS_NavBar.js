import { Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Gem_lot_register from "../screens/Gem_lot_register";

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

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BS_NavBar = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size}) => {
            let iconName;
            let iconSource;
            if (route.name === "Home") {
              iconSource = require("../assets/navbar-icons/home.png");
            } else if (route.name === "Market") {
              iconSource = require("../assets/navbar-icons/market.png");
            } else if (route.name === "AddGem") {
              iconSource = require("../assets/navbar-icons/addgem.png");
            } else if (route.name === "Alerts") {
              iconSource = require("../assets/navbar-icons/alerts.png");
            }else if (route.name === "Profile") {
              iconSource = require("../assets/navbar-icons/profile.png");
            }
            // Return Image component with the correct source and styling
            return (
              <Image
                source={iconSource}
                style={{
                  width: 30,
                  height: size,
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
          component={Gem_lot_register}
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
          name="AddGem"
          component={ProfileScreen}
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
    </NavigationContainer>
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
    backgroundColor: "#003366",
    height: 60,
    position: "absolute",
    overflow: "hidden",
  },
});

export default BS_NavBar;
