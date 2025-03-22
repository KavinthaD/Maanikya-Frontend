import React from "react";
import { SafeAreaView } from "react-native";
import HomePageWorker from "../screens/Home/HomePageWorker";
import Alerts from "../screens/Notification/Alerts";
import Profiles from "../screens/UserProfile/BusinessOwnerProfile";
import { createCustomTabNavigator, icons } from "./NavBarUtils";

const TabArr = [
  {
    route: "HomePageWorker",
    label: "Home",
    activeIcon: icons.home.active,
    inActiveIcon: icons.home.inactive,
    component: HomePageWorker,
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

export default function W_NavBar() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {createCustomTabNavigator(TabArr, "HomePageWorker")}
    </SafeAreaView>
  );
}