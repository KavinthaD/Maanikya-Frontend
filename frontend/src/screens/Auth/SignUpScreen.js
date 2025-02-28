//Screen creator: Dulith

import React from "react";
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
import HomePageBusiness from "../Home/HomePageBusiness";


const SignUpScreen = () => {
  const navigation = useNavigation(); 
  return (
    <View style={[baseScreenStyles.container]}>
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button}
      onPress={() => navigation.navigate(HomePageBusiness)} >
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>
    </View>
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
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "grey",
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#1a237e",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SignUpScreen;
