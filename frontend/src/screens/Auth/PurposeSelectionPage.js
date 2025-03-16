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
import { baseScreenStylesNew } from "../../styles/baseStylesNew";


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
    <View style={[baseScreenStylesNew.backgroundColor, baseScreenStylesNew.container]}>
      <Animated.Image
        source={require("../../assets/logo-gem.png")}
        style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
      />
      <Image
        source={require("../../assets/logo-letter.png")}
        style={styles.logoLetter}
      />
      <Text style={[styles.title, baseScreenStylesNew.blackText]}>I'm here to,</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={baseScreenStylesNew.Button3}
          onPress={() => navigation.navigate("SignUpBusiness")}>
          <Text style={baseScreenStylesNew.buttonText}>Manage my business</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={baseScreenStylesNew.Button2}
          onPress={() => navigation.navigate("RegisterSelectionPage")}
        >
          <Text style={baseScreenStylesNew.buttonText}>Look for gems</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={[styles.orText, baseScreenStylesNew.blackText]}>or</Text>
          <View style={styles.divider} />
        </View>

        <Text style={[styles.loginText, baseScreenStylesNew.blackText]}>Already have an account?</Text>
        <TouchableOpacity
          style={baseScreenStylesNew.Button1}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={baseScreenStylesNew.buttonText}>Log in</Text>
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
    color: "#000",
    marginLeft: 140,
    marginTop: 30,
    marginBottom: 13,
    marginBlockStart: 30,
  },

  card: {
    backgroundColor: "rgba(130, 130, 130, 0.30)",
    padding: 30,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    marginLeft: 20,
    borderColor: "rgba(174, 168, 168, 1)",
    borderWidth: 2
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
  },
  orText: {
    marginHorizontal: 10,
    color: "#000",
    
  },
  loginText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginTop: 2,
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
    color: "#000",
    marginRight: 8,
  },
  globeIcon: {
    width: 28,
    height: 28,
    tintColor: "#000",
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
