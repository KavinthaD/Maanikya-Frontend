import React from "react";
import { StyleSheet, View, Text } from "react-native";

import OwnerOrderTrackDetails from "./src/screens/OwnerOrderTrackDetails";
import WorkerOrderTrackDetails from "./src/screens/WorkerOrderTrackDetails";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkerOrderTrackDetails">
        <Stack.Screen
          name="WorkerOrderTrackDetails"
          component={ WorkerOrderTrackDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

