import React, { useState } from 'react'; // Import useState
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // **Import NavigationContainer**
import BS_NavBar from "./src/components/BS_NavBar";
import AddGems from "./src/screens/AddGems";
import GemLotRegister2 from "./src/screens/GemLotRegister2";
import Header_2 from "./src/components/Header_2";
import Header_1 from "./src/components/Header_1";
import { baseScreenStyles } from './src/styles/baseStyles';


export default function App() {
  const [useHeader1, setUseHeader1] = useState(true);

  return (
    <NavigationContainer> {/* Wrap BS_NavBar with NavigationContainer */}
    <View style={[baseScreenStyles.container,styles.container]}>
      {useHeader1 ? <Header_1 /> : <Header_2 />}  {/* Keep the conditional header if you want it above the tabs */}
      <BS_NavBar /> {/* Render BS_NavBar instead of AddGems */}
    </View>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
