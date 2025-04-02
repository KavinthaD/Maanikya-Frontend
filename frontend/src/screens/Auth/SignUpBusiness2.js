//Screen creator: Dulith

import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { baseScreenStyles } from "../../styles/baseStyles";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData } = route.params; // Retrieve form data from params
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalTitle, setErrorModalTitle] = useState("Registration Failed");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const handleCreateAccount = async () => {
    if (!username || !password || !reEnterPassword) {
      setErrorMessage("All fields are required");
      return;
    }
    if (password !== reEnterPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.REGISTER_USER}`,
        {
          ...formData, // Spread the form data
          username: username,
          password: password,
          confirmPassword: reEnterPassword,
        }
      );

      // Show success animation instead of Alert
      console.log("Registration successful:", response.data);
      setShowSuccessModal(true);

      // Navigate after animation completes
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate("Login");
      }, 2000); // Wait for 2 seconds after animation starts
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );

      // Create a more user-friendly and detailed error message
      let errorMsg = "Registration failed. Please try again.";
      let errorTitle = "Registration Failed";

      if (error.response && error.response.data) {
        // Handle validation errors from the server
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          errorTitle = "Validation Error";

          // Check specifically for password errors
          const passwordErrors = error.response.data.errors.filter(
            (err) => err.path === "password"
          );

          if (passwordErrors.length > 0) {
            // Format password errors specially
            errorTitle = "Password Requirements";
            errorMsg = passwordErrors[0].msg;

            // Add visual formatting for better readability
            errorMsg = errorMsg.replace(
              "Password must be at least 8 characters and contain at least",
              "Password must have:\n\n• At least 8 characters\n•"
            );
            errorMsg = errorMsg.replace(" one number,", " One number\n•");
            errorMsg = errorMsg.replace(
              " one lowercase letter,",
              " One lowercase letter\n•"
            );
            errorMsg = errorMsg.replace(
              " one uppercase letter,",
              " One uppercase letter\n•"
            );
            errorMsg = errorMsg.replace(
              " and one special character",
              " One special character (ex: @#$%)"
            );
          } else {
            // Handle other validation errors as before
            const errorMessages = error.response.data.errors.map((err) => {
              // Convert field name to proper format
              const fieldName =
                err.path.charAt(0).toUpperCase() + err.path.slice(1);

              // Create a field-specific error message
              switch (err.path) {
                case "email":
                  return `${fieldName}: Please enter a valid email address`;
                case "phone":
                  return `${fieldName}: Please enter a valid phone number (10 digits)`;
                case "username":
                  return `${fieldName}: ${err.msg}`;
                default:
                  return `${fieldName}: ${err.msg}`;
              }
            });

            // Join all error messages with line breaks
            errorMsg = errorMessages.join("\n\n");
          }
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      // Show the error modal with improved message
      setErrorModalMessage(errorMsg);
      setErrorModalTitle(errorTitle);
      setErrorModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={baseScreenStyles.colors.background}
      />

      <ScrollView
        contentContainerStyle={baseScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={baseScreenStyles.contentContainer}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={baseScreenStyles.colors.primary}
              />
            </TouchableOpacity>

            <View style={baseScreenStyles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={baseScreenStyles.logo}
              />
            </View>
          </View>

          <Text style={baseScreenStyles.title}>Create Account</Text>
          <Text style={baseScreenStyles.subtitle}>
            Enter your details to complete registration
          </Text>

          <View style={baseScreenStyles.formContainer}>
            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Username"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Entrer Password"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={baseScreenStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                secureTextEntry={!showConfirmPassword}
                value={reEnterPassword}
                onChangeText={setReEnterPassword}
              />
              <TouchableOpacity
                style={baseScreenStyles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {errorMessage ? (
  <View style={styles.inlineErrorContainer}>
    <Ionicons name="alert-circle" size={18} color="#FF3B30" />
    <Text style={styles.inlineErrorText}>{errorMessage}</Text>
  </View>
) : null}

            <TouchableOpacity
              style={baseScreenStyles.primaryButton}
              onPress={handleCreateAccount}
            >
              <Text style={baseScreenStyles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={baseScreenStyles.regularText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={baseScreenStyles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.stepIndicator}>
              <View style={styles.stepInactive}></View>
              <View style={styles.stepActive}></View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

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
          <Text style={styles.errorModalTitle}>{errorModalTitle}</Text>
          <Text style={styles.errorModalMessage}>{errorModalMessage}</Text>
          <TouchableOpacity
            style={styles.errorModalButton}
            onPress={() => setErrorModalVisible(false)}
          >
            <Text style={styles.errorModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={showSuccessModal}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        <View style={styles.successModalContent}>
          <LottieView
            source={require("../../assets/success-animation.json")}
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => setAnimationFinished(true)}
          />
          <Text style={styles.successText}>Registration Successful!</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Only include styles specific to this component that aren't in baseScreenStyles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    marginBottom: 0,
    position: "relative",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  stepActive: {
    width: 30,
    height: 6,
    backgroundColor: baseScreenStyles.colors.primary,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  stepInactive: {
    width: 30,
    height: 6,
    backgroundColor: "#DDD",
    borderRadius: 3,
    marginHorizontal: 4,
  },
  // Add these to your existing styles
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    maxWidth: 340,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 8,
  },
  errorModalMessage: {
    fontSize: 16,
    color: "#757575",
    textAlign: "left",
    marginBottom: 24,
    lineHeight: 22,
    width: "100%",
  },
  errorModalButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorModalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  successModalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    maxWidth: 340,
  },
  animation: {
    width: 150,
    height: 150,
  },
  successText: {
    marginTop: 16,
    fontSize: 18,
    color: baseScreenStyles.colors.primary,
    fontWeight: "600",
  },
  inlineErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  inlineErrorText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
  },
});

export default SignUpScreen;
