import { StyleSheet } from "react-native";

export const baseScreenStylesNew = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "white", // Default background color for all screens
  },
  container: {
    flex: 1,
    backgroundColor: "white", // Default background color for all screens
    position: "relative", // Set position to relative to contain absolutely positioned children
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  Button1: {
    backgroundColor: "#170969",
    padding: 15,
    borderRadius: 24,
    width: "100%",
    alignSelf: "center",
  },
  Button2: {
    backgroundColor: "#02457A",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  Button3: {
    backgroundColor: "#072D44",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
});
