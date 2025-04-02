import React from "react";
import { SafeAreaView } from "react-native";
import HomePageBusiness from "../screens/Home/HomePageBusiness";
import Market from "../screens/Market/Market";
import AddGem from "../screens/GemProfile/GemRegister1";
import Alerts from "../screens/Notification/Alerts";
import Profiles from "../screens/UserProfile/UserProfile";
import { createCustomTabNavigator, icons } from "./NavBarUtils";

const TabArr = [
  {
    route: "Home",
    label: "Home",
    activeIcon: icons.home.active,
    inActiveIcon: icons.home.inactive,
    component: HomePageBusiness,
  },
  {
    route: "Market",
    label: "Market",
    activeIcon: icons.market.active,
    inActiveIcon: icons.market.inactive,
    component: Market,
  },
  { 
    route: "AddGem",
    label: "Add",
    activeIcon: icons.gem.active,
    inActiveIcon: icons.gem.inactive,
    component: AddGem,
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

export default function BS_NavBar() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {createCustomTabNavigator(TabArr, "Home")}
    </SafeAreaView>
  );
}