import React from "react";
import { StyleSheet, View } from "react-native";

// Define base styles that are common across screens
const styles = StyleSheet.create({
  
  backgroundColor: 'transparent',
  container: {
    flex: 1,
    
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  blueButton: {
    backgroundColor: "#005A8C",
    padding: 15,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  helperText: {
    color: "grey",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export const baseScreenStyles = {
  ...styles,
};
