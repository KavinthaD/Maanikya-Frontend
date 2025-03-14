
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
  Button3: {
    backgroundColor: "#5a72a1",
    padding: 5,
    borderRadius: 10,
    width: "40%",
    alignSelf: "center",
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
  infoCard: {
    backgroundColor: "#99f0ff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  themeColor:{
    backgroundColor: "#9CCDDB",
    color: "9CCDDB",
  }
});

export const baseScreenStyles = {
  ...styles,
};
