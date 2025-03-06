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
import axios from "axios"; // Import axios
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    // Make handleLogin async
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

    try {
      const response = await axios.post("http://10.0.2.2:5000/api/auth/login", {
        // Replace with your backend URL if different
        email: email,
        password: password,
        loginRole: backendLoginRole, // Use the mapped backend role
      });

      // **Successful Login:**
      console.log("Login successful:", response.data);
      Alert.alert("Login Successful!", response.data.message);

      // **Store the JWT token securely (using AsyncStorage):**
      await AsyncStorage.setItem("authToken", response.data.token);

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
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Display backend error message
      } else {
        setErrorMessage(
          "Login failed. Please check your credentials and try again."
        ); // Generic error message
      }
    }
  };

  // New function to bypass backend for testing
  const handleTestLogin = (testRole) => {
    // Set the role based on the test role
    setRole(testRole);
    // Navigate based on the test role
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
    <View style={[baseScreenStyles.container, styles.container]}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
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
      <TouchableOpacity
        style={[baseScreenStyles.blueButton, styles.loginButton]}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Test Login Buttons */}
      <View style={styles.testLoginContainer}>
        <TouchableOpacity
          style={styles.testLoginButton}
          onPress={() => handleTestLogin("gem_business_owner")}
        >
          <Text style={styles.testLoginButtonText}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.testLoginButton}
          onPress={() => handleTestLogin("cutter_burner")}
        >
          <Text style={styles.testLoginButtonText}>W</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.testLoginButton}
          onPress={() => handleTestLogin("customer")}
        >
          <Text style={styles.testLoginButtonText}>C</Text>
        </TouchableOpacity>
      </View>
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
  testLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  testLoginButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  testLoginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Login;
