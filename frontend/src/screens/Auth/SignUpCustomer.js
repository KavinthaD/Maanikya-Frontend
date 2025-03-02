//Screen creator: Dulith

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import SuccessPopup from "../../components/SuccessPopup";

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

  const handleCreateAccount = () => {
 
 if (!firstName || !lastName || !email || !phoneNumber || !userName || !password || !reEnterPassword) {
  setErrorMessage("All fields are required");
  return;
}
if (password !== reEnterPassword) {
  setErrorMessage("Passwords do not match");
  return;
}

setPopupVisible(true);
setTimeout(() => {
  navigation.navigate("BS_NavBar");
}, 2500);
};
  return (
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
      <SuccessPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        message="Account created successfully!"
      />
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
