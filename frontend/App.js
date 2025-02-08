import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useState } from 'react';

import AlertsScreen from './src/screens/AlertsScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import WelcomePage from './src/screens/WelcomePage';
import OwnerOrderTrackDetails from './src/screens/OwnerOrderTrackDetails';
import WorkerOrderTrackDetails from './src/screens/WorkerOrderTrackDetails';
import OrderPopup from './src/screens/WorkerAcceptingOrder';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="View Order Request Button" onPress={() => setModalVisible(true)} />
      <OrderPopup visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
