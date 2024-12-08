import React from 'react';
import { StyleSheet, View } from 'react-native';
import Gem_lot_register from './src/screens/Gem_lot_register';

export default function App() {
  return (
    <View style={styles.container}>
      <Gem_lot_register />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
