//recreating navbar from scratch

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import HomePageBusiness from "../screens/Home/HomePageBusiness";
import Market from "../screens/Market";
import AddGem from "../screens/GemProfile/GemRegister1";
import Alerts from "../screens/Notification/Alerts";
import Profiles from "../screens/UserProfile/BusinessOwnerProfile";

// Import your custom icons
const homeIcon = require("../assets/navbar-icons/home.png");
const homeIconOutline = require("../assets/navbar-icons/home-outline.png");
const gemIcon = require("../assets/navbar-icons/gem.png");
const gemIconOutline = require("../assets/navbar-icons/gem-outline.png");
const marketIcon = require("../assets/navbar-icons/market.png");
const marketIconOutline = require("../assets/navbar-icons/market-outline.png");
const notificationIcon = require("../assets/navbar-icons/notification.png");
const notificationIconOutline = require("../assets/navbar-icons/notification-outline.png");
const userIcon = require("../assets/navbar-icons/user.png");
const userIconOutline = require("../assets/navbar-icons/user-outline.png");

const TabArr = [
  {
    route: "Home",
    label: "Home",
    activeIcon: homeIcon,
    inActiveIcon: homeIconOutline,
    component: HomePageBusiness,
  },
  {
    route: "Market",
    label: "Market",
    activeIcon: marketIcon,
    inActiveIcon: marketIconOutline,
    component: Market,
  },
  { 
    route: "AddGem",
    label: "Gem",
    activeIcon: gemIcon,
    inActiveIcon: gemIconOutline,
    component: AddGem,
  },
  {
    route: "Alerts",
    label: "Bell",
    activeIcon: notificationIcon,
    inActiveIcon: notificationIconOutline,
    component: Alerts,
  },
  {
    route: "Profiles",
    label: "User",
    activeIcon: userIcon,
    inActiveIcon: userIconOutline,
    component: Profiles,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: { scale: 1.2 },
        1: { scale: 1.5 },
      });
    } else {
      viewRef.current.animate({
        0: { scale: 1.5 },
        1: { scale: 1.2 },
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { top: 0 }]}
    >
      <Animatable.View ref={viewRef} duration={1000}>
        <Image
          source={focused ? item.activeIcon : item.inActiveIcon}
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? "#fff" : "#fff",
          }} // Adjust size and color
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function BS_NavBar() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
       initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor:"#072D44",
            height: 60,
            position: "absolute",
            margin: 16,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        {TabArr.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
});