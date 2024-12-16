import React from 'react';
import { StyleSheet, View } from 'react-native';
import SelectionPage from './src/screens/selectionPage';
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
