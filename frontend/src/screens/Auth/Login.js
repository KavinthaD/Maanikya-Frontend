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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { baseScreenStyles } from "../../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
<<<<<<< Updated upstream
=======
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: "Gem business owner", value: "Gem business owner" }, // Ensure values match backend roles exactly
    { label: "Cutter/Burner", value: "Cutter/Burner" },       // Ensure values match backend roles exactly
    { label: "Customer", value: "Customer" }              // Ensure values match backend roles exactly
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
>>>>>>> Stashed changes

  const handleLogin = async () => { // Make handleLogin async
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

<<<<<<< Updated upstream
    // **Role Mapping for Backend:**
    let backendLoginRole = "";
    if (role === "gem_business_owner") {
      backendLoginRole = "Gem business owner";
    } else if (role === "cutter_burner") {
      backendLoginRole = "Cutter/Burner";
    } else if (role === "customer") {
      backendLoginRole = "Customer";
    } else {
      Alert.alert("Please select a role."); // Keep this alert for role selection
      return;
    }
=======
>>>>>>> Stashed changes

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/login', { // Replace with your backend URL if different
        email: email,
        password: password,
<<<<<<< Updated upstream
        loginRole: backendLoginRole, // Use the mapped backend role
=======
        loginRole: role, // Use the selected 'role' directly (values should match backend)
>>>>>>> Stashed changes
      });

      // **Successful Login:**
      console.log("Login successful:", response.data);
      Alert.alert("Login Successful!", response.data.message);

      // **Store the JWT token securely (using AsyncStorage):**
      await AsyncStorage.setItem('authToken', response.data.token);

<<<<<<< Updated upstream
      // **Navigate based on user role after successful login:**
      if (response.data.user.loginRole === "Gem business owner") {
        navigation.navigate("BS_NavBar");
      } else if (response.data.user.loginRole === "Cutter/Burner") {
        navigation.navigate("W_NavBar");
      } else if (response.data.user.loginRole === "Customer") {
        navigation.navigate("C_NavBar");
      }

    } catch (error) {
      // **Login Error:**
      console.error("Login failed:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Display backend error message
=======
      // Navigate after animation completes
      setTimeout(() => {
        setShowSuccessModal(false);
        if (response.data.user.loginRole === "Gem business owner") {
          navigation.navigate("BS_NavBar");
        } else if (
          response.data.user.loginRole === "Cutter" || // Adjust conditions to match backend roles if needed
          response.data.user.loginRole === "Burner" ||
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
      if (error.response && error.response.status === 403) { // Check for 403 status
        setErrorMessage("The role you selected is not authorized for this account. Please select the correct role.");
      } else if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
>>>>>>> Stashed changes
      } else {
        setErrorMessage("Login failed. Please check your credentials and try again."); // Generic error message
      }
    }
  };

<<<<<<< Updated upstream
  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
=======
  // For testing only
  const handleTestLogin = (testRole) => {
    setRole(testRole);
    if (testRole === "Gem business owner") {
      navigation.navigate("BS_NavBar");
    } else if (testRole === "Cutter/Burner") {
      navigation.navigate("W_NavBar");
    } else if (testRole === "Customer") {
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
                    onPress={() => handleTestLogin("Gem business owner")} // Use actual backend role values
                  >
                    <Text style={styles.devButtonText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.devButton}
                    onPress={() => handleTestLogin("Cutter/Burner")} // Use actual backend role values
                  >
                    <Text style={styles.devButtonText}>W</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.devButton}
                    onPress={() => handleTestLogin("Customer")} // Use actual backend role values
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
>>>>>>> Stashed changes
      />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Choose your role" value="" />
          <Picker.Item label="Gem business owner" value="gem_business_owner" />
          <Picker.Item label="Cutter/Burner" value="cutter_burner" />
          <Picker.Item label="Customer" value="customer" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
       {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[baseScreenStyles.blueButton,styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 170,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  prompt: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    width: "100%",
    height: 54,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  picker: {
    height: "100%",
    width: "100%",
  },
  pickerItem: {
    color: "#888",
  },
  inputWithOpacity: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
  },
  forgotPassword: {
    color: "#007bff",
    marginBottom: 20,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Login;