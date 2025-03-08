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
import HomePageWorker from "../screens/Home/HomePageWorker";
import Alerts from "../screens/Notification/Alerts";
import Profiles from "../screens/UserProfile/BusinessOwnerProfile";

// Import your custom icons
const homeIcon = require("../assets/navbar-icons/home.png");
const homeIconOutline = require("../assets/navbar-icons/home-outline.png");
const marketIcon = require("../assets/navbar-icons/market.png");
const marketIconOutline = require("../assets/navbar-icons/market-outline.png");
const notificationIcon = require("../assets/navbar-icons/notification.png");
const notificationIconOutline = require("../assets/navbar-icons/notification-outline.png");
const userIcon = require("../assets/navbar-icons/user.png");
const userIconOutline = require("../assets/navbar-icons/user-outline.png");

const TabArr = [
  {
    route: "HomePageWorker",
    label: "Home",
    activeIcon: homeIcon,
    inActiveIcon: homeIconOutline,
    component: HomePageWorker,
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
        0: { scale: 1.4 },
        1: { scale: 1.7 },
      });
    } else {
      viewRef.current.animate({
        0: { scale: 1.7 },
        1: { scale: 1.4 },
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
            tintColor: focused ? "white" : "grey",
          }} // Adjust size and color
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function C_NavBar() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#072D44",
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
