// Purpose: Test individual components/screens of the app.

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import BS_NavBar from "./src/components/BS_NavBar";

const App = () => {
return (
  <View style={styles.container}>
    <BS_NavBar/>
  </View>
);
};

export default App;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    });