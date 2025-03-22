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
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { baseScreenStyles } from "../../styles/baseStyles";

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

      // **Successful Registration:**
      console.log("Registration successful:", response.data);
      Alert.alert("Registration Successful!", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      // **Registration Error:**
      console.error(
        "Registration failed:",
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
        setErrorMessage("Registration failed. Please try again."); // Generic error message
      }
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
              <Text style={baseScreenStyles.errorText}>{errorMessage}</Text>
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
});

export default SignUpScreen;