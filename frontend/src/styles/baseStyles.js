
import { StyleSheet} from "react-native";

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
  Button2: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#0082A7",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  
  Button1: {
    backgroundColor: "#498b9c",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
  },
  helperText: {
    color: "#a6a6a6",
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
