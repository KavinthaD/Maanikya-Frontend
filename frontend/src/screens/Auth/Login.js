//Screen creator: Dulith   // login

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
import { Picker } from "@react-native-picker/picker";
import { baseScreenStyles } from "../../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

      // Store token and navigate
      await AsyncStorage.setItem("authToken", response.data.token);

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
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(
          "Login failed. Please check your credentials and try again."
        );
      }
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

          <View style={baseScreenStyles.formContainer}>
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

            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <View style={baseScreenStyles.pickerContainer}>
                <Picker
                  selectedValue={role}
                  style={[baseScreenStyles.picker, { color: role ? baseScreenStyles.colors.text.dark : "#888" }]}
                  onValueChange={(itemValue) => setRole(itemValue)}
                >
                  <Picker.Item label="Select your role" value="" color="#888" />
                  <Picker.Item
                    label="Gem business owner"
                    value="gem_business_owner"
                    color={baseScreenStyles.colors.text.dark}
                  />
                  <Picker.Item
                    label="Cutter/Burner"
                    value="cutter_burner"
                    color={baseScreenStyles.colors.text.dark}
                  />
                  <Picker.Item 
                    label="Customer" 
                    value="customer" 
                    color={baseScreenStyles.colors.text.dark}
                  />
                </Picker>
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

            {errorMessage ? (
              <Text style={baseScreenStyles.errorText}>{errorMessage}</Text>
            ) : null}

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
    </SafeAreaView>
  );
};

// Only keep screen-specific styles that aren't already in baseScreenStyles
const styles = StyleSheet.create({
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
});

export default Login;