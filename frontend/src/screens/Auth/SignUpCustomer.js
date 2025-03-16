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
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import SuccessPopup from "../../components/SuccessPopup"; 
import axios from 'axios'; // Import axios
import { useNavigation } from "@react-navigation/native";

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
    <View style={[baseScreenStylesNew.container, styles.container]}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={[styles.subtitle, baseScreenStylesNew.blackText]}>Sign Up</Text>
      <Text style={[styles.instructions, baseScreenStylesNew.blackText]}>Create Your Customer Account</Text>
      <View style={styles.row}>
        <View style={styles.inputHalfContainer}>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={baseScreenStylesNew.input}
          placeholder="John"
          placeholderTextColor="#B0B0B0"
          value={firstName}
          onChangeText={setFirstName}
        />
        </View>
        <View style={styles.inputHalfContainer}>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={baseScreenStylesNew.input}
          placeholder="Doe"
          placeholderTextColor="#B0B0B0"
          value={lastName}
          onChangeText={setLastName}
        />
        </View>
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="example@domain.com"
        keyboardType="email-address"
        placeholderTextColor="#B0B0B0"
        value={email}
        onChangeText={setEmail}
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="+94 71 796 7845"
        keyboardType="phone-pad"
        placeholderTextColor="#B0B0B0"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Username</Text>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="Choose a username"
        placeholderTextColor="#B0B0B0"
        value={userName}
        onChangeText={setUserName}
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="Enter password"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput
        style={baseScreenStylesNew.input}
        placeholder="Re-enter password"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        value={reEnterPassword}
        onChangeText={setReEnterPassword}
      />
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={baseScreenStylesNew.Button1}
        onPress={handleCreateAccount}>
        <Text style={baseScreenStylesNew.buttonText}>Create account</Text>
      </TouchableOpacity>
      
      {/* <SuccessPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        message="Account created successfully!"
      /> */}
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    paddingTop: 120,
    width: 170,
    height: 80,
    marginTop: 90,
    marginBottom: 8,
},
  subtitle: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#000"
  },
  instructions: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    color: "#000"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputHalfContainer: {
    width: "48%",
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 4,
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555555",
    paddingLeft: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreenCustomer; 