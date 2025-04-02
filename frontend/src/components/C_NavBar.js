import React from "react";
import { SafeAreaView } from "react-native";
import HomePageCustomer from "../screens/Home/HomePageCustomer";
import Market from "../screens/Market/Market";
import Alerts from "../screens/Notification/Alerts";
import Profiles from "../screens/UserProfile/UserProfile";
import { createCustomTabNavigator, icons } from "./NavBarUtils";

const TabArr = [
  {
    route: "HomePageCustomer",
    label: "Home",
    activeIcon: icons.home.active,
    inActiveIcon: icons.home.inactive,
    component: HomePageCustomer,
  },
  {
    route: "Market",
    label: "Market",
    activeIcon: icons.market.active,
    inActiveIcon: icons.market.inactive,
    component: Market,
  },
  {
    route: "Alerts",
    label: "Alerts",
    activeIcon: icons.notification.active,
    inActiveIcon: icons.notification.inactive,
    component: Alerts,
  },
  {
    route: "Profiles",
    label: "Profile",
    activeIcon: icons.user.active,
    inActiveIcon: icons.user.inactive,
    component: Profiles,
  },
];

export default function C_NavBar() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {createCustomTabNavigator(TabArr, "HomePageCustomer")}
    </SafeAreaView>
  );
}