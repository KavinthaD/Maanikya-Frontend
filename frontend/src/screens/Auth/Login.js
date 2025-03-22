//Screen creator: Dulith   // login

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";
import { Ionicons } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import DropDownPicker from "react-native-dropdown-picker";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: "Gem business owner", value: "gem_business_owner" },
    { label: "Cutter/Burner", value: "cutter_burner" },
    { label: "Customer", value: "customer" }
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const getRoleLabel = () => {
    const selectedRole = roleItems.find(item => item.value === role);
    return selectedRole ? selectedRole.label : null;
  };

  const handleLogin = async () => {
    // Validation
    if (!email || !password || !role) {
      Alert.alert("Please fill all fields.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    setErrorMessage("");

    // Role Mapping for Backend
    let backendLoginRole = "";
    if (role === "gem_business_owner") {
      backendLoginRole = "Gem business owner";
    } else if (role === "cutter_burner") {
      backendLoginRole = "Cutter/Burner";
    } else if (role === "customer") {
      backendLoginRole = "Customer";
    } else {
      Alert.alert("Please select a role.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}${ENDPOINTS.LOGIN}`, {
        email: email,
        password: password,
        loginRole: backendLoginRole,
      });

      // Store token
      await AsyncStorage.setItem("authToken", response.data.token);

      // Show success animation
      setShowSuccessModal(true);

      // Navigate after animation completes
      setTimeout(() => {
        setShowSuccessModal(false);
        if (response.data.user.loginRole === "Gem business owner") {
          navigation.navigate("BS_NavBar");
        } else if (
          response.data.user.loginRole === "Burner" ||
          response.data.user.loginRole === "Cutter" ||
          response.data.user.loginRole === "Electric Burner"
        ) {
          navigation.navigate("W_NavBar");
        } else if (response.data.user.loginRole === "Customer") {
          navigation.navigate("C_NavBar");
        }
      }, 2000); // Wait for 2 seconds after animation starts

    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      
      // Get error message from the server response
      let errorMsg = "Login failed. Please check your credentials and try again.";
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      }
      
      // Show error modal instead of inline error
      setErrorModalMessage(errorMsg);
      setErrorModalVisible(true);
    }
  };

  // For testing only
  const handleTestLogin = (testRole) => {
    setRole(testRole);
    if (testRole === "gem_business_owner") {
      navigation.navigate("BS_NavBar");
    } else if (testRole === "cutter_burner") {
      navigation.navigate("W_NavBar");
    } else if (testRole === "customer") {
      navigation.navigate("C_NavBar");
    } else {
      Alert.alert("Invalid role for testing.");
    }
  };

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={baseScreenStyles.colors.background} />
      <ScrollView contentContainerStyle={baseScreenStyles.scrollContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={baseScreenStyles.contentContainer}
        >
          <View style={baseScreenStyles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={baseScreenStyles.logo}
            />
          </View>

          <View style={[baseScreenStyles.formContainer, { zIndex: 1000 }]}>
            <Text style={baseScreenStyles.title}>Welcome Back</Text>
            <Text style={baseScreenStyles.subtitle}>Sign in to continue</Text>

            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Email"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{zIndex: 9999, elevation: 1000}}>
              <View style={baseScreenStyles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#888"
                  style={baseScreenStyles.inputIcon}
                />
                <baseScreenStyles.RoleSelectorField
                  role={getRoleLabel()}
                  placeholder="Select your role"
                  onPress={() => setShowRoleModal(true)}
                />
              </View>
            </View>

            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Password"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={baseScreenStyles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={baseScreenStyles.primaryButton} onPress={handleLogin}>
              <Text style={baseScreenStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={baseScreenStyles.regularText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterSelectionPage")}
              >
                <Text style={baseScreenStyles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Test Login Buttons - only in development */}
            {__DEV__ && (
              <View style={styles.developerSection}>
                <Text style={styles.developerTitle}>Developer Buttons</Text>
                <View style={styles.testLoginContainer}>
                  <TouchableOpacity
                    style={styles.devButton}
                    onPress={() => handleTestLogin("gem_business_owner")}
                  >
                    <Text style={styles.devButtonText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.devButton}
                    onPress={() => handleTestLogin("cutter_burner")}
                  >
                    <Text style={styles.devButtonText}>W</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.devButton}
                    onPress={() => handleTestLogin("customer")}
                  >
                    <Text style={styles.devButtonText}>C</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal
        isVisible={showSuccessModal}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <LottieView
            source={require('../../assets/success-animation.json')}
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => setAnimationFinished(true)}
          />
          <Text style={styles.successText}>Login Successful!</Text>
        </View>
      </Modal>
      <baseScreenStyles.RoleSelectorModal
        isVisible={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Select your role"
        options={roleItems}
        selectedValue={role}
        onSelect={(value) => setRole(value)}
      />
      <Modal
        isVisible={errorModalVisible}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.errorText}>{errorModalMessage}</Text>
          <TouchableOpacity
            style={baseScreenStyles.primaryButton}
            onPress={() => setErrorModalVisible(false)}
          >
            <Text style={baseScreenStyles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Error Modal */}
      <Modal
        isVisible={errorModalVisible}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        <View style={styles.errorModalContent}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={50} color="#FF6B6B" />
          </View>
          <Text style={styles.errorModalTitle}>Login Failed</Text>
          <Text style={styles.errorModalMessage}>{errorModalMessage}</Text>
          <TouchableOpacity 
            style={styles.errorModalButton}
            onPress={() => setErrorModalVisible(false)}
          >
            <Text style={styles.errorModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Only keep screen-specific styles that aren't already in baseScreenStyles
const styles = StyleSheet.create({
  noAutoFillBackground: {
    backgroundColor: 'transparent !important',
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPassword: {
    color: baseScreenStyles.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  developerSection: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
  },
  developerTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  testLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  devButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: baseScreenStyles.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  devButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  animation: {
    width: 150,
    height: 150,
  },
  successText: {
    marginTop: 16,
    fontSize: 18,
    color: baseScreenStyles.colors.primary,
    fontWeight: '600',
  },
  roleSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingRight: 12,
  },
  roleSelectorText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
  },
  roleModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleModalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedRoleOption: {
    backgroundColor: `${baseScreenStyles.colors.primary}10`,
  },
  roleOptionText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
  },
  selectedRoleOptionText: {
    color: baseScreenStyles.colors.primary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '600',
    marginBottom: 16,
  },
  errorModalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  errorModalMessage: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorModalButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;