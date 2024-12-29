import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterSelectionPage from './src/screens/RegisterSelectionPage';
import Gem_lot_register from './src/screens/Gem_lot_register';
import PurposeSelectionPage from './src/screens/PurposeSelectionPage';
import NavigationBar from './src/components/BS_NavBar';
import BS_NavBar from './src/components/BS_NavBar';
import MyGems from './src/screens/MyGems';
import GemOnDisplay from './src/screens/GemOnDisplay';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './src/screens/WelcomePage';

const Stack = createStackNavigator();


export default function App() {
  return (
    //<View style={styles.container}>
      //<PurposeSelectionPage/>
    //</View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomePage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="PurposeSelectionPage" component={PurposeSelectionPage} />
        <Stack.Screen name=" PurposeSelectionPage" component={PurposeSelectionPage} options={{ headerShown: false}}/>
        <Stack.Screen name="RegisterSelectionPage" component={RegisterSelectionPage} options={{ title: 'Register'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
