import { Image } from "react-native";
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";

import Gem_register_1 from "../screens/GemRegister1";
import Gem_register_2 from "../screens/GemRegister2";

import Gem_register_3 from "../screens/GemRegister3";
import Header_1 from "../components/Header_1";
import Header_2 from "../components/Header_2";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

// Create a stack navigator for Add Gem flow
function AddGemsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="GemRegister1"
        component={Gem_register_1}
        options={{
          header: () => <Header_1 title="Add Gem" />,
        }}
      />
      <Stack.Screen
        name="GemRegister2"
        component={Gem_register_2}
        options={{
          header: () => <Header_2 title="Gem Register" />,
        }}
      />
      <Stack.Screen
        name="GemRegister3"
        component={Gem_register_3}
        options={{
          header: () => <Header_2 title="QR Code" />,
        }}
      />
    </Stack.Navigator>
  );
}

export default function BS_NavBar({ navigation }) {
  const [headerTitle, setHeaderTitle] = useState("Home"); // Default title is "Home"

  return (
    <NavigationContainer>
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
            header: () => <Header_1 title="Home" />, // Use Header_1 for Home and set title
          }}
        />
        <Tab.Screen
          name="Market"
          component={MarketScreen}
          options={{
            header: () => <Header_1 title="Market" />, // Use Header_1 for Home and set title
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddGemsStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={{
            header: () => <Header_1 title="Alerts" />, // Use Header_1 for Home and set title
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            header: () => <Header_1 title="Profile" />, // Use Header_1 for Home and set title
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
