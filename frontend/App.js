import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ConnectScreen from "./src/screens/ConnectScreen";
import ProfileScreen from "./src/screens/ConnectedUsers";
import CutterFinancialRecords from "./src/screens/CutterFinancialRecords";
import OwnerFinancialRecords from "./src/screens/ownerFinancialRecords";
import ConnectScreens from "./src/screens/ConnectScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ConnectScreen" component={ConnectScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
