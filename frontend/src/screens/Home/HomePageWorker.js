//Screen Creator Tilmi

import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import Header_1 from "../../components/Header_1";
import GradientContainer from "../../components/GradientContainer"; // Import the GradientContainer

const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image source={image} style={styles.imageStyle} resizeMode="contain" />
    </View>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const menuItems = [
    {
      image: require("../../assets/menu-icons/Orders.png"),
      title: "Orders",
      screen: "Orders",
    },
    {
      image: require("../../assets/menu-icons/financialRecords.png"),
      title: "Financial\nRecords",
      screen: "CutterFinancialRecords",
    },
    {
      image: require("../../assets/menu-icons/scan.png"),
      title: "Scan",
    },
  ];
  const handleMenuItemPress = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName); // Navigate to the specified screen
    } else {
      console.log(`No screen defined for this item`); // Optional: Handle cases where no screen is specified
    }
  };

  return (
    <GradientContainer>
      <SafeAreaView style={baseScreenStyles.container}>
        <Header_1 title="Home" />
        <View style={styles.content}>
          <Text style={styles.greeting}>Hello Sriyan,</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                image={item.image}
                title={item.title}
                onPress={() => handleMenuItemPress(item.screen)}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },

  content: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
});

const App = () => {
  return (
    <>
      <HomeScreen />
    </>
  );
};

export default App;
