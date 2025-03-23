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
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: "Gem business owner", value: "gem_business_owner" },
    { label: "Cutter/Burner", value: "cutter_burner" },
    { label: "Customer", value: "customer" },
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [autoLoginToastVisible, setAutoLoginToastVisible] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);
  const [inlineErrorMessage, setInlineErrorMessage] = useState("");
  const [errorModalTitle, setErrorModalTitle] = useState("Login Failed");
  const [successModalMessage, setSuccessModalMessage] = useState("Login Successful!");

  const getRoleLabel = () => {
    const selectedRole = roleItems.find((item) => item.value === role);
    return selectedRole ? selectedRole.label : null;
  };

  const handleLogin = async () => {
    // Validation
    if (!email || !password || !role) {
      setInlineErrorMessage("Please fill all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setInlineErrorMessage("Invalid email format.");
      return;
    }

    // Clear error message when proceeding with login
    setInlineErrorMessage("");

    // Role Mapping for Backend
    let backendLoginRole = "";
    if (role === "gem_business_owner") {
      backendLoginRole = "Gem business owner";
    } else if (role === "cutter_burner") {
      backendLoginRole = "Cutter/Burner";
    } else if (role === "customer") {
      backendLoginRole = "Customer";
    } else {
      setInlineErrorMessage("Please select a role.");
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

      // Store login timestamp
      const loginTime = new Date().getTime();
      await AsyncStorage.setItem("lastLoginTime", loginTime.toString());
      await AsyncStorage.setItem("loginRole", response.data.user.loginRole);

      // Show success animation and auto-login toast simultaneously
      setShowSuccessModal(true);
      setAutoLoginToastVisible(true);

      // Hide toast after 5 seconds
      setTimeout(() => {
        setAutoLoginToastVisible(false);
      }, 5000);

      // Navigate after animation completes
      setTimeout(() => {
        setShowSuccessModal(false);
        if (response.data.user.loginRole === "Gem business owner") {
          navigation.navigate("BS_NavBar");
        } else if (response.data.user.loginRole === "Cutter/Burner") {
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
      let errorMsg =
        "Login failed. Please check your credentials and try again.";

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

  // Step 1: Request password reset code
  const handleRequestResetCode = async () => {
    // Validate email
    if (!forgotPasswordEmail) {
      setErrorModalMessage("Please enter your email address");
      setErrorModalVisible(true);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(forgotPasswordEmail)) {
      setErrorModalMessage("Please enter a valid email address");
      setErrorModalVisible(true);
      return;
    }

    try {
      // Request password reset via API
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.FORGOT_PASSWORD}`,
        {
          email: forgotPasswordEmail,
        }
      );

      // Show success message
      setResetEmailSent(true);

      // After 2 seconds, close current modal and open reset password modal
      setTimeout(() => {
        setForgotPasswordModalVisible(false);
        setResetPasswordModalVisible(true);
      }, 2000);
    } catch (error) {
      console.error("Password reset request failed:", error);

      // Get error message from the response
      let errorMsg = "Failed to send reset code. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMsg = error.response.data.message;
      }

      setErrorModalMessage(errorMsg);
      setErrorModalVisible(true);
    }
  };

  // Step 2: Submit reset code and new password
  const handleResetPassword = async () => {
    // Validate inputs
    if (!resetCode || !newPassword || !confirmNewPassword) {
      setErrorModalTitle("Input Error");
      setErrorModalMessage("Please fill all fields");
      setErrorModalVisible(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorModalTitle("Password Error");
      setErrorModalMessage("Passwords don't match");
      setErrorModalVisible(true);
      return;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorModalTitle("Password Requirements");
      setErrorModalMessage(
        "Password must be at least 8 characters and contain at least one number, one lowercase letter, one uppercase letter, and one special character"
      );
      setErrorModalVisible(true);
      return;
    }

    try {
      // Submit reset request
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.RESET_PASSWORD}`,
        {
          email: forgotPasswordEmail,
          resetCode: resetCode,
          newPassword: newPassword,
        }
      );

      // Close reset modal
      setResetPasswordModalVisible(false);

      // Set success message before showing the success modal
      setSuccessModalMessage("Your password has been successfully reset. You can now log in with your new password.");

      // Show success animation
      setShowSuccessModal(true);

      // Clear form fields
      setResetCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setForgotPasswordEmail("");
      setResetEmailSent(false);

      // Hide success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        // Reset the success message back to default for future logins
        setSuccessModalMessage("Login Successful!");
      }, 3000);
    } catch (error) {
      console.error("Password reset failed:", error);

      // Get error message from the response
      let errorMsg = "Password reset failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMsg = error.response.data.message;
      }

      setErrorModalTitle("Reset Failed");
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

  useEffect(() => {
    if (inlineErrorMessage) {
      setInlineErrorMessage("");
    }
  }, [email, password, role]);

  return (
    <>
      <SafeAreaView style={baseScreenStyles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={baseScreenStyles.colors.background}
        />
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
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={{ zIndex: 9999, elevation: 1000 }}>
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
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
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

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => setForgotPasswordModalVisible(true)}
              >
                <Text style={styles.forgotPassword}>Forgot your password?</Text>
              </TouchableOpacity>

              {inlineErrorMessage ? (
                <View style={styles.inlineErrorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#FF3B30" />
                  <Text style={styles.inlineErrorText}>
                    {inlineErrorMessage}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={baseScreenStyles.primaryButton}
                onPress={handleLogin}
              >
                <Text style={baseScreenStyles.buttonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={baseScreenStyles.regularText}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RegisterSelectionPage")}
                >
                  <Text style={baseScreenStyles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Test Login Buttons - only in development */}
              {/* {__DEV__ && (
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
              )} */}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        {/* Forgot Password Modal - Step 1 */}
        <Modal
          isVisible={forgotPasswordModalVisible}
          backdropOpacity={0.5}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
          style={styles.modal}
        >
          <View style={styles.forgotPasswordModalContent}>
            <View style={styles.forgotPasswordIconContainer}>
              <Ionicons
                name="key-outline"
                size={40}
                color={baseScreenStyles.colors.primary}
              />
            </View>

            {!resetEmailSent ? (
              <>
                <Text style={styles.forgotPasswordTitle}>Forgot Password</Text>
                <Text style={styles.forgotPasswordDescription}>
                  Enter your email address and we'll send you a code to reset
                  your password.
                </Text>

                <View
                  style={[
                    baseScreenStyles.inputWrapper,
                    styles.forgotPasswordInput,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color="#888"
                    style={baseScreenStyles.inputIcon}
                  />
                  <TextInput
                    style={baseScreenStyles.input}
                    placeholder="Email Address"
                    placeholderTextColor={
                      baseScreenStyles.colors.input.placeholder
                    }
                    value={forgotPasswordEmail}
                    onChangeText={setForgotPasswordEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.forgotPasswordButtonsContainer}>
                  <TouchableOpacity
                    style={styles.forgotPasswordCancelButton}
                    onPress={() => setForgotPasswordModalVisible(false)}
                  >
                    <Text style={styles.forgotPasswordCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.forgotPasswordSendButton}
                    onPress={handleRequestResetCode}
                  >
                    <Text style={styles.forgotPasswordSendText}>Send Code</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <LottieView
                  source={require("../../assets/success-animation.json")}
                  autoPlay
                  loop={false}
                  style={styles.smallAnimation}
                />
                <Text style={styles.forgotPasswordTitle}>Code Sent!</Text>
                <Text style={styles.forgotPasswordDescription}>
                  A password reset code has been sent to your email address.
                </Text>
              </>
            )}
          </View>
        </Modal>

        {/* Reset Password Modal - Step 2 */}
        <Modal
          isVisible={resetPasswordModalVisible}
          backdropOpacity={0.5}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
          style={styles.modal}
        >
          <View style={styles.forgotPasswordModalContent}>
            <View style={styles.forgotPasswordIconContainer}>
              <Ionicons
                name="lock-open-outline"
                size={40}
                color={baseScreenStyles.colors.primary}
              />
            </View>

            <Text style={styles.forgotPasswordTitle}>Reset Password</Text>
            <Text style={styles.forgotPasswordDescription}>
              Enter the code sent to your email and create a new password.
              (Check spam folder as well)
            </Text>

            <View
              style={[
                baseScreenStyles.inputWrapper,
                styles.forgotPasswordInput,
              ]}
            >
              <Ionicons
                name="key-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Reset Code"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={resetCode}
                onChangeText={setResetCode}
              />
            </View>

            <View
              style={[
                baseScreenStyles.inputWrapper,
                styles.forgotPasswordInput,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="New Password"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                secureTextEntry={!isNewPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={baseScreenStyles.eyeIcon}
                onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              >
                <Ionicons
                  name={
                    isNewPasswordVisible ? "eye-off-outline" : "eye-outline"
                  }
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                baseScreenStyles.inputWrapper,
                styles.forgotPasswordInput,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Confirm New Password"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                secureTextEntry={!isConfirmNewPasswordVisible}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              <TouchableOpacity
                style={baseScreenStyles.eyeIcon}
                onPress={() =>
                  setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)
                }
              >
                <Ionicons
                  name={
                    isConfirmNewPasswordVisible
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.forgotPasswordButtonsContainer}>
              <TouchableOpacity
                style={styles.forgotPasswordCancelButton}
                onPress={() => setResetPasswordModalVisible(false)}
              >
                <Text style={styles.forgotPasswordCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordSendButton}
                onPress={handleResetPassword}
              >
                <Text style={styles.forgotPasswordSendText}>
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Success Modal */}
        <Modal
          isVisible={showSuccessModal}
          backdropOpacity={0.5}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
          coverScreen={false}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <LottieView
              source={require("../../assets/success-animation.json")}
              autoPlay
              loop={false}
              style={styles.animation}
              onAnimationFinish={() => setAnimationFinished(true)}
            />
            <Text style={styles.successText}>{successModalMessage}</Text>
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
      </SafeAreaView>
      {/* Auto-login Toast Notification - moved outside SafeAreaView */}
      {autoLoginToastVisible && (
        <View style={styles.autoLoginToast}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#FFF"
            style={styles.toastIcon}
          />
          <Text style={styles.toastText}>Auto-login enabled for 1 hour</Text>
        </View>
      )}
    </>
  );
};

// Only keep screen-specific styles that aren't already in baseScreenStyles
const styles = StyleSheet.create({
  noAutoFillBackground: {
    backgroundColor: "transparent !important",
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
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
  roleSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingRight: 12,
  },
  roleSelectorText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
  },
  roleModal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  roleModalContent: {
    backgroundColor: "white",
    width: "80%",
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
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 16,
    textAlign: "center",
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    fontWeight: "500",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "600",
    marginBottom: 16,
  },
  errorModalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
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
    textAlign: "center",
    marginBottom: 24,
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
  autoLoginToast: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 9999,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  forgotPasswordModalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  forgotPasswordIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${baseScreenStyles.colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  forgotPasswordTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 8,
  },
  forgotPasswordDescription: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
    textAlign: "center",
    marginBottom: 24,
  },
  forgotPasswordInput: {
    width: "100%",
  },
  forgotPasswordButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  forgotPasswordCancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordSendButton: {
    flex: 1,
    backgroundColor: baseScreenStyles.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordCancelText: {
    color: baseScreenStyles.colors.text.dark,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordSendText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  smallAnimation: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  inlineErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
  },
  inlineErrorText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontSize: 14,
    flex: 1,
  },
});

export default Login;
