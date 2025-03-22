import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { baseScreenStylesNew } from "../styles/baseStylesNew";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomePage = ({ navigation }) => {
  const fadeValue = useRef(new Animated.Value(0)).current;
  const revealValue = useRef(new Animated.Value(0)).current;

  // Function to check for auto-login eligibility
  const checkAutoLogin = async () => {
    try {
      // Get auth token, login time and role
      const authToken = await AsyncStorage.getItem("authToken");
      const lastLoginTimeStr = await AsyncStorage.getItem("lastLoginTime");
      const loginRole = await AsyncStorage.getItem("loginRole");
      
      if (!authToken || !lastLoginTimeStr || !loginRole) {
        // If any required info is missing, continue to purpose selection page
        return false;
      }
      
      // Calculate time difference in milliseconds
      const lastLoginTime = parseInt(lastLoginTimeStr);
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastLoginTime;
      
      // Check if login was within the last hour (3600000 milliseconds = 1 hour)
      const oneHourInMs = 3600000;
      
      if (timeDifference < oneHourInMs) {
        // Auto-login based on role
        setTimeout(() => {
          if (loginRole === "Gem business owner") {
            navigation.replace("BS_NavBar");
          } else if (
            loginRole === "Burner" ||
            loginRole === "Cutter" ||
            loginRole === "Electric Burner"
          ) {
            navigation.replace("W_NavBar");
          } else if (loginRole === "Customer") {
            navigation.replace("C_NavBar");
          } else {
            navigation.replace("PurposeSelectionPage");
          }
        }, ); // Give time to show animation
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Auto-login check failed:", error);
      return false;
    }
  };

  useEffect(() => {
    // First: Fade in the gem
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Second: Reveal text from left to right
      Animated.timing(revealValue, {
        toValue: 350, // Full width of text container
        duration: 1000,
        useNativeDriver: false,
      }).start(async () => {
        // Check if we should auto-login
        const shouldAutoLogin = await checkAutoLogin();
        
        // If not auto-login, continue to purpose selection after a delay
        if (!shouldAutoLogin) {
          setTimeout(() => {
            navigation.replace("PurposeSelectionPage");
          }, 1000);
        }
      });
    });
  }, [navigation]);

  return (
    <View style={[baseScreenStylesNew.container, styles.container]}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require("../assets/logo-gem.png")}
          style={[styles.gemLogo, { opacity: fadeValue }]}
          resizeMode="contain"
        />
        <View style={styles.textWrapper}>
          <Animated.View style={[styles.revealMask, { width: revealValue }]}>
            <Animated.Image
              source={require("../assets/logo-letter.png")}
              style={styles.textLogo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: 350,
  },
  gemLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 0,
    width: 350,
    height: 100,
    overflow: 'hidden',
  },
  revealMask: {
    height: '100%',
    overflow: 'hidden',
  },
  textLogo: {
    width: 350,
    height: 100,
  }
});

export default WelcomePage;