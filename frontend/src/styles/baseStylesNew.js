import { StyleSheet } from "react-native";

export const baseScreenStylesNew = StyleSheet.create({
  // ----- backgrounds
  themeColor: {
    backgroundColor: '#170969'   
  },
  backgroundColor: {
    backgroundColor: "white", // Default background color for all screens
  },
  container: {
    flex: 1,
    backgroundColor: "white", // Default background color for all screens
    position: "relative",
  },

// ---- texts -----------
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
  themeText: {
    color: '#170969',    //theme color letters
  },
  blackText: {
    color: "black"
  },
  whiteText: {
    color: "white"
  },
// --------------check box
  checkBox: {
    backgroundColor: 'rgba(155, 140, 245, 0.75)',
  },
  justBox: {
    backgroundColor: 'rgba(215, 208, 254, 0.75)',
  },

  // ---- text container
  item: {
    backgroundColor:'rgba(172, 168, 168, 0.21)',
  },

  // ---- Buttons ------
  Button1: {
    backgroundColor: "#170969",   //theme color button 
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
  cancelButton: {
    backgroundColor: 'rgba(172, 168, 168, 0.21)',
    borderWidth:2,
    borderColor: 'rgba(172, 168, 168, 0.21)',
    padding: 12,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },

  // --------- auth forms ---------------
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

  // -------- search bar --------------
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
    color: "#999",
    fontSize: 24
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  
  // -------------- Tabs ------------------
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

  // ---- Pop Up gradient
/* 
<LinearGradient
            colors={[
              'rgb(3, 15, 79)',
              'rgb(11, 10, 43)'
            ]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
  
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
*/
});
