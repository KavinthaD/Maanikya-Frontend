import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import GemOnDisplay from './src/screens/GemOnDisplay';
import Login1 from './src/screens/Login1';
import Login2 from './src/screens/Login2';
import SignUpScreen from './src/screens/SignUpScreen';
import Login3 from './src/screens/Login3';
import CompletedTracker from './src/screens/CompletedTracker';
import InProgressTracker from './src/screens/InProgressTracker';
import OngoingTracker from './src/screens/OngoingTracker';
import Alerts from './src/screens/Alerts';
import Orders from './src/screens/Orders';
import SignUpScreenCustomer from './src/screens/SignUpScreenCustomer';


export default function App() {
  return (
    <View style={styles.container}>
      <SignUpScreenCustomer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
