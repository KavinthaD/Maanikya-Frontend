import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import GemOnDisplay from './src/screens/GemOnDisplay';
import BusinessOwnerProfilePhoto from './src/screens/BusinessOwnerProfilePhoto';
import Tracker from './src/screens/Tracker';
import CustomerProfile from './src/screens/CustomerProfile';

import BusinessOwnerProfile from './src/screens/BusinessOwnerProfile';
import BusinessOwnerEditProfile from './src/screens/BusinessOwnerEditProfile';
import GemCertificateAdd from './src/screens/GemCertificateAdd';



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/*<Stack.Screen name="BusinessOwnerEditProfile" component={BusinessOwnerEditProfile} />
        <Stack.Screen name="BusinessOWnerProfile" component={BusinessOwnerProfile} />
        <Stack.Screen name="BusinessOwnerProfilePhoto" component={BusinessOwnerProfilePhoto} />*/}
        {/*<Stack.Screen name="GemONDisplay" component={GemOnDisplay} />
        <Stack.Screen name="Tracker" component={Tracker} />*/}
       {/*<Stack.Screen name="MyGems" component={MyGems} />
         <Stack.Screen name = "GemCertificateAdd" component={GemCertificateAdd} />*/}
        <Stack.Screen name="CustomerProfile" component={CustomerProfile} />
        
     
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


