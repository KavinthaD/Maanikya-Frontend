import React from 'react';
import { StyleSheet, View } from 'react-native';
// import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
// import Gem_lot_register from './src/screens/Gem_lot_register';
// import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
// import NavigationBar from './src/components/BS_NavBar';
// import BS_NavBar from './src/components/BS_NavBar';
// import MyGems from './src/screens/MyGems';
// import GemOnDisplay from './src/screens/GemOnDisplay';
// import NavigationBar from './src/components/BS_NavBar';
// import BS_NavBar from './src/components/BS_NavBar';
// import HomeScreen from './src/screens/HomeScreen';
import HomeMyGems from './src/screens/HomeMyGems';
// import Favorites from './src/screens/Favorites';
// import CustomHomePage from './src/screens/CustomHomePage';
// import CutterHomePage from './src/screens/CutterHomePage';
// import Market from './src/screens/Market';


export default function App() {
  return (
    <View style={styles.container}>
      <HomeMyGems />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

