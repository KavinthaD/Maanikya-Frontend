import { StyleSheet } from "react-native";

export const baseScreenStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#9CCDDB", // Default background color for all screens
  },
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB", // Default background color for all screens
    position: "relative", // Set position to relative to contain absolutely positioned children
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
    width: "95%",
    alignSelf: "center", // Center the button horizontally
  },
  // blueButton: {
  //   backgroundColor: "#170969",
  //   padding: 15,
  //   borderRadius: 10,
  //   position: "absolute",
  //   left: 30, // Distance from left
  //   right: 30, // Distance from right
  // },
  helperText: {
    color: "grey",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
