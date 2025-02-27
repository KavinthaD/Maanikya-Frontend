// Purpose: Test individual components/screens of the app.

import React from "react";
import { StyleSheet, View } from "react-native";
import BS_NavBar from "./src/components/BS_NavBar";

// Import all screens
import Alerts from "./src/screens/Alerts";
import AlertsScreen from "./src/screens/AlertsScreen";
import BurnerFinancialRecords from "./src/screens/BurnerFinancialRecords";
import BusinessOwnerEditProfile from "./src/screens/BusinessOwnerEditProfile";
import BusinessOwnerProfile from "./src/screens/BusinessOwnerProfile";
import BusinessOwnerProfilePhoto from "./src/screens/BusinessOwnerProfilePhoto";
import CompletedTracker from "./src/screens/CompletedTracker";
import ConnectedUsers from "./src/screens/ConnectedUsers";
import ConnectScreen from "./src/screens/ConnectScreen";
import Customeraddseller from "./src/screens/Customeraddseller";
import CustomerProfile from "./src/screens/CustomerProfile";
import CutterFinancialRecords from "./src/screens/CutterFinancialRecords";
import CutterHomePage from "./src/screens/CutterHomePage";
import Favorites from "./src/screens/Favorites";
import GemCertificateAdd from "./src/screens/GemCertificateAdd";
import GemOnDisplay from "./src/screens/GemOnDisplay";
import GemRegister1 from "./src/screens/GemRegister1";
import GemRegister2 from "./src/screens/GemRegister2";
import HomeMyGems from "./src/screens/HomeMyGems";
import HomeScreen from "./src/screens/HomeScreen";
import InProgressTracker from "./src/screens/InProgressTracker";
import Login1 from "./src/screens/Login1";
import Login2 from "./src/screens/Login2";
import Market from "./src/screens/Market";
import MyGems from "./src/screens/MyGems";
import OngoingTracker from "./src/screens/OngoingTracker";
import Orders from "./src/screens/Orders";
import OwnerFinancialRecords from "./src/screens/ownerFinancialRecords";
import OwnerOrderTrackDetails from "./src/screens/OwnerOrderTrackDetails";
import PurposeSelectionPage from "./src/screens/PurposeSelectionPage";
import RegisterSelectionPage from "./src/screens/RegisterSelectionPage";
import SignUpScreenCustomer from "./src/screens/SignUpScreenCustomer";
import Tracker from "./src/screens/Tracker";
import WelcomePage from "./src/screens/WelcomePage";
import WorkerOrderTrackDetails from "./src/screens/WorkerOrderTrackDetails";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GemRegister1">
        <Stack.Screen 
        name="GemRegister1" 
        options={{
          headerShown: false,
        }} 
        component={GemRegister1} />
        <Stack.Screen name="GemRegister2" component={GemRegister2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
