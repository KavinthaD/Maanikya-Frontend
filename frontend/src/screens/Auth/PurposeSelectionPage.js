//Screen creator: Thulani

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import LinearGradient from "react-native-linear-gradient";
import GradientContainer from "../../components/GradientContainer";

const PurposeSelectionPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 880,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <GradientContainer>
    <View style={baseScreenStyles.container}>
      <Animated.Image
        source={require("../../assets/logo-gem.png")}
        style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
      />
      <Image
        source={require("../../assets/logo-letter.png")}
        style={styles.logoLetter}
      />
      <Text style={styles.title}>I'm here to,</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUpBusiness")}
        >
          <Text style={styles.buttonText}>Manage my business</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RegisterSelectionPage")}
        >
          <Text style={styles.buttonText}>Look for gems</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.languageText}>ENG ▼</Text>
          <Image
            source={require("../../assets/globe.png")}
            style={styles.globeIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                console.log("Sinhala selected");
                setModalVisible(false); // Close modal after selecting
              }}
            >
              <Text style={styles.languageOptionText}>සිංහල</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                console.log("English selected");
                setModalVisible(false); // Close modal after selecting
              }}
            >
              <Text style={styles.languageOptionText}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 139,
    height: 93,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 100,
  },
  logoLetter: {
    aspectRatio: 2,
    height: 118,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: -20,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 120,
    marginBottom: 48,
    marginBlockStart: 30,
  },

  subtitle: {
    fontSize: 20,
    color: "#000",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "rgba(92, 125, 134, 0.51)",
    marginTop: -36,
    padding: 30,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    marginLeft: 20,
    elevation: 5,
    shadowColor: " rgba(0, 0, 0, 0.46)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    backgroundColor: "#170969",
    paddingVertical: 12,
    borderRadius: 50,
    width: "100%",
    marginVertical: 5,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff",
  },
  orText: {
    marginHorizontal: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "b",
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: "#9CCDDB",
    paddingVertical: 8,
    borderRadius: 70,
    width: "80%",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#170969",
    fontSize: 15,
    fontWeight: "semi-bold",
    textAlign: "center",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 88,
    marginBottom: 60,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
  },

  languageText: {
    fontSize: 14,
    color: "#ffffff",
    marginRight: 8,
  },
  globeIcon: {
    width: 28,
    height: 28,
    tintColor: "#ffffff",
  },
  logoContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: 200,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  languageOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});

export default PurposeSelectionPage;
