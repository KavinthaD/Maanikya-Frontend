import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import GemOnDisplay from './src/screens/GemOnDisplay';
import BusinessOwnerProfilePhoto from './src/screens/BusinessOwnerProfilePhoto';
import Tracker from './src/screens/Tracker';


export default function App() {
  return (
    <View style={styles.container}>
      <Tracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
