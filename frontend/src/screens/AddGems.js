import React, { useState } from "react"; // **Import useState**
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
import GemLotRegister1 from "./GemLotRegister1"; // Import GemLotRegister2

const YourScreenComponent = () => {
  // **Conditional Rendering: If state is false, render original button screen**
  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText2}>Create gem lot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText2}>Add a gem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={baseScreenStyles.blueButton}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    padding: 20,
    paddingVertical: 90,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 38,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default YourScreenComponent;
