import { Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";

import GemRegister1 from "../screens/GemRegister1";
import GemOnDisplay from "../screens/GemOnDisplay";
import Alerts from "../screens/AlertsScreen";
import HomeScreen from "../screens/HomeScreen";
import BusinessOwnerProfile from "../screens/BusinessOwnerProfile";

const Tab = createBottomTabNavigator();

export default function BS_NavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconSource;
          let iconWidth = 30;
          let iconHeight = size;

          if (route.name === "Home") {
            iconSource = require("../assets/navbar-icons/home.png");
          } else if (route.name === "Market") {
            iconSource = require("../assets/navbar-icons/market.png");
          } else if (route.name === "Add") {
            iconSource = require("../assets/navbar-icons/addgem.png");
            iconWidth = 35;
            iconHeight = 35;
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
        headerShown: false, // Hide headers inside tab screens
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Market" component={GemOnDisplay} />
      <Tab.Screen name="Add" component={GemRegister1} />
      <Tab.Screen name="Alerts" component={Alerts} />
      <Tab.Screen name="Profile" component={BusinessOwnerProfile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#072D44",
    height: 80,
    position: "absolute",
    overflow: "hidden",
    paddingTop: 5,
  },
});
