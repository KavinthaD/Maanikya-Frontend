import React from 'react';
import { StyleSheet, View } from 'react-native';
<<<<<<< Updated upstream
import MySellersScreen from './src/screens/CustomerFinancialRecords';
// import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
// import Gem_lot_register from './src/screens/Gem_lot_register';
// import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
// import NavigationBar from './src/components/BS_NavBar';
// import BS_NavBar from './src/components/BS_NavBar';
// import MyGems from './src/screens/MyGems';
// import GemOnDisplay from './src/screens/GemOnDisplay';
=======
import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import GemOnDisplay from './src/screens/GemOnDisplay';
import MySellersScreen from './src/screens/CustomerFinancialRecords';
// import FinancialRecords from './src/screens/FinancialRecords';
// import AlertsScreen from './src/screens/AlertsScreen';
>>>>>>> Stashed changes
// import BusinessOwnerProfile from './src/screens/BusinessOwnerProfile';

export default function App() {
  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <MySellersScreen/>
      {/* <BusinessOwnerProfile /> */}
=======
      {/* <BusinessOwnerProfile /> */}
      {/* <FinancialRecords/> */}
      {/* <AlertsScreen/> */}
      <MySellersScreen/>
>>>>>>> Stashed changes
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
