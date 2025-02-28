//Screen creator: Thulani

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { baseScreenStyles } from "../../styles/baseStyles";

const RegisterSelectionPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={[baseScreenStyles.container, styles.container]}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("SignUpScreenCustomer")}
        >
          <Text style={styles.createAccountText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => navigation.navigate("Market")}
        >
          <Text style={styles.guestText}>Continue as a guest</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },

  logo: {
    marginTop: 100,
    width: 250,
    height: 194,
    resizeMode: "contain",
  },

  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },

  createAccountButton: {
    backgroundColor: "#170969",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
  },
  createAccountText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  guestButton: {
    backgroundColor: "#09690F",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 8,
    marginBottom: 250,
  },
  guestText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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

export default RegisterSelectionPage;
