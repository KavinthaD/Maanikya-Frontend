import React from "react";
import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
import Gem_lot_register_2 from "./src/screens/GemLotRegister1";
import Gem_lot_register_1 from "./src/screens/GemLotRegister1";
import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
import Header_1 from "./src/components/Header_2";
import MyGems from "./src/screens/MyGems";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import { NavigationContainer } from '@react-navigation/native'; // **Import NavigationContainer**
import { createStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import HomeScreen from "./src/screens/HomeDummy";
import BS_NavBar from "./src/components/BS_NavBar";

const Stack = createStackNavigator(); // Or your chosen navigator type
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

export default function App() {
  return (
    <NavigationContainer> 
     
      <BS_NavBar /> 
    </NavigationContainer>
  );
}