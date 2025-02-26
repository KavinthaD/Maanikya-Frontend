import { StyleSheet } from "react-native";

export const baseScreenStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#9CCDDB", // Default background color for all screens
  },
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB", // Default background color for all screens
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  blueButton: {
    backgroundColor: "#170969",
    padding: 15,
    borderRadius: 10,
    position: "absolute", // Position absolutely
    bottom: -50, // Distance from bottom
    left: 30, // Distance from left
    right: 30, // Distance from right
  },
});

