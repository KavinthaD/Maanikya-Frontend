import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

// Create a function that returns the navigation bar JSX with icons
const renderNavigationBar = (activeScreen, navigation) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity 
        style={[
          styles.footerItem, 
          activeScreen === "Home" && styles.activeFooterItem
        ]}
        onPress={() => navigation && navigation.navigate("Home")}
      >
        <Image 
          source={require('../assets/navbar-icons/home-outline.png')} 
          style={styles.footerIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerItem, 
          activeScreen === "Market" && styles.activeFooterItem
        ]}
        onPress={() => navigation && navigation.navigate("Market")}
      >
        <Image 
          source={require('../assets/navbar-icons/market-outline.png')} 
          style={styles.footerIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerItem, 
          activeScreen === "Add" && styles.activeFooterItem
        ]}
        onPress={() => navigation && navigation.navigate("Add")}
      >
        <Image 
          source={require('../assets/navbar-icons/gem-outline.png')} 
          style={styles.footerIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerItem, 
          activeScreen === "Alerts" && styles.activeFooterItem
        ]}
        onPress={() => navigation && navigation.navigate("AlertsScreen")}
      >
        <Image 
          source={require('../assets/navbar-icons/notification-outline.png')} 
          style={styles.footerIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerItem, 
          activeScreen === "Profile" && styles.activeFooterItem
        ]}
        onPress={() => navigation && navigation.navigate("Profile")}
      >
        <Image 
          source={require('../assets/navbar-icons/user-outline.png')} 
          style={styles.footerIcon} 
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

// Create a function that returns the header JSX
const renderHeader = (title, onBackPress) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

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
  headerContainer: {
    backgroundColor: '#072D44',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '300',
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#072D44', 
    paddingVertical: 12,
    justifyContent: 'space-around',
    borderTopWidth: 0, 
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerItem: {
    alignItems: 'center',
    padding: 8,
    width: '20%',
  },
  footerIcon: {
    width: 24,
    height: 24, 
    tintColor: '#FFFFFF',
  },
  activeFooterItem: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  activeFooterText: {
    fontWeight: 'bold',
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
  renderNavigationBar,
  renderHeader,
};