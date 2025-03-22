import React, { useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { baseScreenStyles } from "../styles/baseStyles";

// Import all icons used by the navbars
const icons = {
  home: {
    active: require("../assets/navbar-icons/home.png"),
    inactive: require("../assets/navbar-icons/home-outline.png"),
  },
  market: {
    active: require("../assets/navbar-icons/market.png"),
    inactive: require("../assets/navbar-icons/market-outline.png"),
  },
  gem: {
    active: require("../assets/navbar-icons/gem.png"),
    inactive: require("../assets/navbar-icons/gem-outline.png"),
  },
  notification: {
    active: require("../assets/navbar-icons/notification.png"),
    inactive: require("../assets/navbar-icons/notification-outline.png"),
  },
  user: {
    active: require("../assets/navbar-icons/user.png"),
    inactive: require("../assets/navbar-icons/user-outline.png"),
  },
};

// Convert hex color to rgba with opacity
const hexToRgba = (hex, opacity) => {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values to get r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba format
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Update the TabButton component with animations
export const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  
  // Get primary color with 15% opacity for the background highlight
  const highlightColor = hexToRgba(baseScreenStyles.colors.primary.replace('#', ''), 0.15);
  
  // Animation references
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (focused) {
      // Animate in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [focused, scaleAnim, opacityAnim]);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButton}
    >
      <View style={styles.tabIconContainer}>
        <Animated.View 
          style={[
            styles.activeBackground, 
            { 
              backgroundColor: highlightColor,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]} 
        />
        <Image
          source={focused ? item.activeIcon : item.inActiveIcon}
          style={[
            styles.tabIcon,
            focused ? styles.tabIconActive : styles.tabIconInactive
          ]}
        />
        <Text 
          style={[
            styles.tabLabel,
            focused ? styles.tabLabelActive : styles.tabLabelInactive
          ]}
        >
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Create reusable navigator
export const createCustomTabNavigator = (routeConfig, initialRouteName = "") => {
  const Tab = createBottomTabNavigator();
  
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {routeConfig.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.route}
          component={item.component}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => <TabButton {...props} item={item} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

// Share these styles across all navbars
export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    height: 64,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    position: "relative",
    width: 70, // Fixed width to ensure consistent spacing
    height: 46, // Fixed height to contain both icon and text
  },
  activeBackground: {
    position: "absolute",
    width: 60,
    height: 35,
    borderRadius: 16,
    top: 1,
    left: "10%",
    transform: [{ translateX: -30 }], // Adjusted to half the width (60/2)
    zIndex: 0,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginTop: 10,
    marginBottom: 5,
    zIndex: 1,
    alignSelf: "center",
  },
  tabIconActive: {
    tintColor: baseScreenStyles.colors.primary,
  },
  tabIconInactive: {
    tintColor: "#757575",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    zIndex: 1,
  },
  tabLabelActive: {
    color: baseScreenStyles.colors.primary,
  },
  tabLabelInactive: {
    color: "#757575",
  }
});

// Export the icons so they can be used in the navbar components
export { icons };