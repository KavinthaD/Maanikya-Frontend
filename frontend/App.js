import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Header_2 from "./src/components/Header_2";
import Header_1 from "./src/components/Header_1";
import BS_NavBar from "./src/components/BS_NavBar";
import { baseScreenStyles } from "./src/styles/baseStyles";



export default function App() {
  return (
    <View style={styles.container}>
      <BS_NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
