import { Image } from "react-native";
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import GemRegister1 from "../screens/GemRegister1";
import Gem_register_2 from "../screens/GemRegister2";
import Gem_register_3 from "../screens/GemRegister3";
import Header_1 from "../components/Header_1";
import Header_2 from "../components/Header_2";
import Alerts from "../screens/AlertsScreen";

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

export default function BS_NavBar({ navigation }) {
  const [headerTitle, setHeaderTitle] = useState("Home"); // Default title is "Home"

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
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
            return (
              <Image
                source={iconSource}
                style={{
                  width: iconWidth,
                  height: iconHeight,
                  tintColor: color,
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
            header: () => <Header_1 title="Home" />,
          }}
        />
        <Tab.Screen
          name="Market"
          component={MarketScreen}
          options={{
            header: () => <Header_1 title="Market" />,
          }}
        />
        <Tab.Screen
          name="Add"
          component={GemRegister1}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={{
            header: () => <Header_1 title="Alerts" />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            header: () => <Header_1 title="Profile" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
