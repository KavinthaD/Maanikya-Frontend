//Screen creator: Dulith

import React, { useState, useRef, useEffect } from "react";
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
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { baseScreenStyles } from "../../styles/baseStyles";

const SignUpScreenCustomer = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Reference to the ScrollView for programmatic scrolling
  const scrollViewRef = useRef(null);
  // References to the input fields for focus management
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Monitor keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Clear error message when any input changes
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [
    firstName,
    lastName,
    email,
    phoneNumber,
    userName,
    password,
    reEnterPassword,
  ]);

  const handleCreateAccount = async () => {
    // Validation logic remains the same
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !userName ||
      !password ||
      !reEnterPassword
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email format.");
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
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phoneNumber,
          username: userName,
          password: password,
          confirmPassword: reEnterPassword,
          accountType: "customer",
        }
      );

      // **Successful Customer Registration:**
      console.log("Customer registration successful:", response.data);
      Alert.alert("Registration Successful!", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      // **Customer Registration Error:**
      console.error(
        "Customer registration failed:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data && error.response.data.errors) {
        const errorList = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        setErrorMessage("Registration failed:\n" + errorList);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage("Registration failed: " + error.response.data.message);
      } else {
        setErrorMessage("Customer registration failed. Please try again.");
      }

      // Scroll to the bottom to show the error message
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  };
  const scrollPartially = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        // Scroll to a specific position (adjust the 300 value as needed)
        // Lower values scroll less, higher values scroll more
        scrollViewRef.current.scrollTo({ y: 50, animated: true });
      }
    }, 100);
  };
  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={baseScreenStyles.colors.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            baseScreenStyles.scrollContent,
            // Add extra padding at bottom when keyboard is visible
            keyboardVisible && { paddingBottom: 120 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={baseScreenStyles.contentContainer}>
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

            <Text style={[baseScreenStyles.title, styles.title]}>
              Create Customer Account
            </Text>
            <Text style={baseScreenStyles.subtitle}>
              Enter your details to get started
            </Text>

            <View style={baseScreenStyles.formContainer}>
              <View style={baseScreenStyles.row}>
                <View style={baseScreenStyles.halfWidth}>
                  <View style={baseScreenStyles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#888"
                      style={baseScreenStyles.inputIcon}
                    />
                    <TextInput
                      style={baseScreenStyles.input}
                      placeholder="First Name"
                      placeholderTextColor={
                        baseScreenStyles.colors.input.placeholder
                      }
                      value={firstName}
                      onChangeText={setFirstName}
                      returnKeyType="next"
                      onSubmitEditing={() => lastNameRef.current?.focus()}
                    />
                  </View>
                </View>

                <View style={baseScreenStyles.halfWidth}>
                  <View style={baseScreenStyles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#888"
                      style={baseScreenStyles.inputIcon}
                    />
                    <TextInput
                      ref={lastNameRef}
                      style={baseScreenStyles.input}
                      placeholder="Last Name"
                      placeholderTextColor={
                        baseScreenStyles.colors.input.placeholder
                      }
                      value={lastName}
                      onChangeText={setLastName}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                </View>
              </View>

              <View style={baseScreenStyles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#888"
                  style={baseScreenStyles.inputIcon}
                />
                <TextInput
                  ref={emailRef}
                  style={baseScreenStyles.input}
                  placeholder="Email Address"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </View>

              <View style={baseScreenStyles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#888"
                  style={baseScreenStyles.inputIcon}
                />
                <TextInput
                  ref={phoneRef}
                  style={baseScreenStyles.input}
                  placeholder="Phone Number"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  returnKeyType="next"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                />
              </View>

              <View style={baseScreenStyles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#888"
                  style={baseScreenStyles.inputIcon}
                />
                <TextInput
                  ref={usernameRef}
                  style={baseScreenStyles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  autoCapitalize="none"
                  value={userName}
                  onChangeText={setUserName}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onFocus={scrollPartially}
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
                  ref={passwordRef}
                  style={baseScreenStyles.input}
                  placeholder="Create a password"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
                  ref={confirmPasswordRef}
                  style={baseScreenStyles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  secureTextEntry={!showConfirmPassword}
                  value={reEnterPassword}
                  onChangeText={setReEnterPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateAccount}
                />
                <TouchableOpacity
                  style={baseScreenStyles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Only include styles specific to this component that aren't in baseScreenStyles
const styles = StyleSheet.create({
  title: {
    marginTop: -30,
  },
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
    marginTop: 6,
    marginBottom: 20, // Add extra bottom margin
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

export default SignUpScreenCustomer;
