import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from "react-native";


import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import WelcomePage from './src/screens/WelcomePage';
import OwnerOrderTrackDetails from './src/screens/OwnerOrderTrackDetails';
import WorkerOrderTrackDetails from './src/screens/WorkerOrderTrackDetails';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OwnerOrderTrackDetails />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

