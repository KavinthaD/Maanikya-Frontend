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
import { useNavigation } from "@react-navigation/native";
import { baseScreenStyles } from "../../styles/baseStyles";
import SuccessPopup from "../../components/SuccessPopup"; // You are using this, keep it
import axios from 'axios'; // Import axios
import GradientContainer from "../../components/GradientContainer";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = async () => { // Make async
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
    // Password regex validation - consider adding this if you have specific password requirements

    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/register-step2', { // Step 2 endpoint
        username: username,
        password: password,
        confirmPassword: reEnterPassword,
      });

      // **Successful Step 2 Registration:**
      console.log("Step 2 registration successful:", response.data);
      Alert.alert("Registration Successful!", response.data.message, [ // Use Alert for success
        { text: "OK", onPress: () => navigation.navigate("Login") } // Navigate to Login after successful registration
      ]);

      // Optionally, you might want to store the token or user data here if needed for immediate login

    } catch (error) {
      // **Step 2 Registration Error:**
      console.error("Step 2 registration failed:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        // Backend is sending validation errors as an array
        const errorList = error.response.data.errors.map(err => err.msg).join("\n");
        setErrorMessage("Registration failed:\n" + errorList);
      } else if (error.response && error.response.data && error.response.data.message) {
        // Backend is sending a single error message
        setErrorMessage("Registration failed: " + error.response.data.message);
      }
      else {
        setErrorMessage("Step 2 registration failed. Please try again."); // Generic error message
      }
    }
  };

  return (
    <GradientContainer>
    <View style={[baseScreenStyles.container]}>
      <View style={styles.container}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.row}></View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          secureTextEntry={true}
           placeholderTextColor="#888"
           value={reEnterPassword}
          onChangeText={setReEnterPassword}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>
      </View>
      {/* SuccessPopup - you can keep this if you want a popup in addition to the Alert, or remove if you just want the Alert */}
      {/* <SuccessPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        message="Sign Up Success!"
      /> */}
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: "130%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginTop:30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    opacity:0.8,
  },

  button: {
    width: "130%",
    height: 40,
    backgroundColor: "#1a237e",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
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

export default SignUpScreen;