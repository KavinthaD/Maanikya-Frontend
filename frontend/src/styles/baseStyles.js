import React from "react";
import { StyleSheet, View } from "react-native";

// Define base styles that are common across screens
const styles = StyleSheet.create({
  backgroundColor: 'transparent',
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    colors: [
      '#6B8391', // 9%
      '#436072', // 23%
      '#25475B', // 47%
      '#163A4F', // 68%
      '#072D44', // 89%
    ],
    locations: [0, 0.23, 0.47, 0.68, 0.89],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
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
