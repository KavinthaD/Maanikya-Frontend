import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal, Animated } from "react-native";
import LottieView from "lottie-react-native"; // Import LottieView

const SuccessPopup = ({ visible, onClose }) => {
  const fadeAnim = new Animated.Value(0); // Initial opacity of 0

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // After fade in, wait for 2 seconds then fade out
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0, // Fade out
            duration: 500,
            useNativeDriver: true,
          }).start(onClose);
        }, 2000);
      });
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
          <LottieView
            source={require("../assets/tick.json")} // Path to your tick animation
            autoPlay
            loop={false}
            style={styles.tickAnimation}
          />
          <Text style={styles.message}>Sign Up Success!</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  tickAnimation: {
    width: 150, // Adjust size as needed
    height: 150,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: "#000",
  },
});

export default SuccessPopup;
