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
  buttonText4: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  Button1: {
    backgroundColor: "#170969",
    padding: 15,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  Button2: {
    backgroundColor: "#02457A",
    padding: 12,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  Button3: {
    backgroundColor: "#072D44",
    padding: 12,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  Button4: {
    backgroundColor: "#70B5DF",
    padding: 15,
    borderRadius: 13,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "rgba(130, 130, 130, 0.30)",
    borderColor: "rgba(174, 168, 168, 1) ",
    color: "black"
  },
  pickerContainer: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "rgba(130, 130, 130, 0.30)",
    borderColor: "rgba(174, 168, 168, 1)",
    paddingHorizontal: 10,
    justifyContent: "center",
    color: "black"
  },
  picker: {
    height: "100%",
    width: "100%",
    color: "black"
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'rgba(172, 168, 168, 0.21)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 40,
    
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  

});
