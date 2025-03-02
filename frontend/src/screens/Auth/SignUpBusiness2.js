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
import { useNavigation } from "@react-navigation/native";
import { baseScreenStyles } from "../../styles/baseStyles";
import SuccessPopup from "../../components/SuccessPopup";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = () => {
  
    if (!username || !password || !reEnterPassword) {
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
      <SuccessPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        message="Sign Up Success!"
      />
    </View>
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
