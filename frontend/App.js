import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Header_2 from "./src/components/Header_2";
import Header_1 from "./src/components/Header_1";
import BS_NavBar from "./src/components/BS_NavBar";
import { baseScreenStyles } from "./src/styles/baseStyles";
import OwnerOrderTrackDetails from "./src/screens/OwnerOrderTrackDetails";
import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
import WelcomePage from "./src/screens/WelcomePage";
import WorkerOrderTrackDetails from "./src/screens/WorkerOrderTrackDetails";

import BusinessOwnerProfile from './src/screens/BusinessOwnerProfile';
import BusinessOwnerEditProfile from './src/screens/BusinessOwnerEditProfile';
import GemCertificateAdd from './src/screens/GemCertificateAdd';



const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <BS_NavBar />
    </View>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

