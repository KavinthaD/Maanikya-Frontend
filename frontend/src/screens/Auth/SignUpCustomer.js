//Screen creator: Dulith

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert, // Import Alert
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import SuccessPopup from "../../components/SuccessPopup"; 
import axios from 'axios'; // Import axios
import { useNavigation } from "@react-navigation/native";
import GradientContainer from "../../components/GradientContainer";
import { API_URL, ENDPOINTS } from '../../config/api'; 

const SignUpScreenCustomer = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = async () => { // Make async

    if (!firstName || !lastName || !email || !phoneNumber || !userName || !password || !reEnterPassword) {
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
      const response = await axios.post(`${API_URL}${ENDPOINTS.REGISTER_CUSTOMER}`, { 
        firstName: firstName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phoneNumber,
        username: userName,
        password: password,
        confirmPassword: reEnterPassword, // Include confirmPassword in request
      });

      // **Successful Customer Registration:**
      console.log("Customer registration successful:", response.data);
      Alert.alert("Registration Successful!", response.data.message, [ // Use Alert for success
        { text: "OK", onPress: () => navigation.navigate("Login") } // Navigate to Login after successful registration
      ]);
      // Optionally, you might want to store the token or user data here if needed for immediate login

    } catch (error) {
      // **Customer Registration Error:**
      console.error("Customer registration failed:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        // Backend is sending validation errors as an array
        const errorList = error.response.data.errors.map(err => err.msg).join("\n");
        setErrorMessage("Registration failed:\n" + errorList);
      } else if (error.response && error.response.data && error.response.data.message) {
        // Backend is sending a single error message
        setErrorMessage("Registration failed: " + error.response.data.message);
      }
      else {
        setErrorMessage("Customer registration failed. Please try again."); // Generic error message
      }
    }
  };
  return (
    <GradientContainer>
    <View style={[baseScreenStyles.container, styles.container]}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.subtitle}>Sign Up</Text>
      <Text style={styles.instructions}>Create Your Customer Account</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        keyboardType="email-address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        placeholderTextColor="#888"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        placeholderTextColor="#888"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter password"
        placeholderTextColor="#888"
        secureTextEntry
        value={reEnterPassword}
        onChangeText={setReEnterPassword}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>
      
      {/* <SuccessPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        message="Account created successfully!"
      /> */}
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
  halfInput: {
    width: "48%",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#000080",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreenCustomer; 