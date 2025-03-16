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
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_URL, ENDPOINTS } from '../../config/api'; 

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
      const response = await axios.post(`${API_URL}${ENDPOINTS.LOGIN}`, { 
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
      } else if (response.data.user.loginRole === "Burner" || 
        response.data.user.loginRole === "Cutter" || 
        response.data.user.loginRole === "Electric Burner") {
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
    <View style={[baseScreenStylesNew.container, styles.container]}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={[styles.title, baseScreenStylesNew.blackText]}>Welcome Back</Text>
      <Text style={[styles.subtitle, baseScreenStylesNew.blackText]}>Enter your email to login</Text>

      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="email@domain.com"
        placeholderTextColor={baseScreenStylesNew.searchIcon.color}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={baseScreenStylesNew.pickerContainer}>
        <Picker
          selectedValue={role}
          style={[baseScreenStylesNew.picker, { color: role ? baseScreenStylesNew.input.color : "#888" }]}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Choose your role" value="" color="#888"/>
          <Picker.Item label="Gem business owner" value="gem_business_owner" color="black" />
          <Picker.Item label="Cutter/Burner" value="cutter_burner" color="black"/>
          <Picker.Item label="Customer" value="customer" color="black" />
        </Picker>
      </View>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="Password"
        placeholderTextColor={baseScreenStylesNew.searchIcon.color}
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
        style={[baseScreenStylesNew.Button1,]}
        onPress={handleLogin}
      >
        <Text style={baseScreenStylesNew.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Test Login Buttons */}
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
  );
};

const styles = StyleSheet.create({

  // Add these to your StyleSheet:
  developerSection: {
    width: '100%',
    marginTop: 20,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  developerTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  testLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  devButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  devButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

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
    fontSize: 28,
    marginBottom: 10,
    color: "black"
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "black"
  },

  inputWithOpacity: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
  },
  forgotPassword: {
    color: "#000",
    marginBottom: 20,
    fontWeight: "bold"
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
  errorText: {
    color: "red", 
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  }
});

export default Login;
