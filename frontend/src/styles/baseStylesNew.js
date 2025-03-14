import { StyleSheet } from "react-native";

export const baseScreenStylesNew = StyleSheet.create({
  themeColor: {
    backgroundColor: '#170969'
  },
  themeText: {
    color: '#170969',
    //fontSize: 14,
    //marginBottom: 2,
    //marginLeft: 6,
  },
  popUp: {
    backgroundColor: "white"
  },
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
  buttonText5: {
    color: "#70B5DF",
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
    marginTop: 8
  },
  Button3: {
    backgroundColor: "#072D44",
    padding: 12,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  Button4: {
    backgroundColor: "#70B5DF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 50,
    width: "100%",
  },
  Button5: {
    backgroundColor: "#fff",
    borderColor: "#70B5DF",
    borderWidth:2, 
    padding: 15,
    borderRadius: 24,
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
  
  // -------------- Tab ------------------
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 15
  },
  tabButton: {
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#170969',
  },
  tabButtonInactive: {
    backgroundColor: 'rgba(172, 168, 168, 0.21)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextInactive: {
    color: '#333333',
  },

});
