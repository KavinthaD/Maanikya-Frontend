import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";

const WelcomePage = ({ navigation }) => {
  const fadeValue = useRef(new Animated.Value(0)).current;
  const revealValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // First: Fade in the gem
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      // Second: Reveal text from left to right
      Animated.timing(revealValue, {
        toValue: 350, // Full width of text container
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          navigation.replace("PurposeSelectionPage");
        }, 1000);
      });
    });
  }, [navigation]);

  return (
    <View style={[baseScreenStyles.container, styles.container]}>
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