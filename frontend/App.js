import React from 'react';
import { StyleSheet, View } from 'react-native';
import Gem_lot_register from './src/screens/Gem_lot_register';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';

export default function App() {
  return (
    <View style={styles.container}>
      <BS_NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
