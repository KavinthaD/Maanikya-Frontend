//Screen creator: Dulith

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { baseScreenStyles } from "../styles/baseStyles";

const SignUpScreenCustomer = ({ navigation }) => {
  return (
    <View style={[baseScreenStyles.container,styles.container]}>
      <Image source={require('../assets/logo-gem.png')} style={styles.logo} />
      <Text style={styles.title}>Maanikya</Text>
      <Text style={styles.subtitle}>Create your customer account</Text>
      <Text style={styles.instructions}>Enter your email to sign up for this app</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="First Name" />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Last Name" />
      </View>
      <TextInput style={styles.input} placeholder="email@domain.com" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="User Name" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TextInput style={styles.input} placeholder="Re-enter password" secureTextEntry />
      <TouchableOpacity style={styles.button}
      onPress={() => navigation.navigate('CustomHomePage')} >
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>
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
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white', 
    opacity: 0.7, // Adjust opacity 
  },
  halfInput: {
    width: '48%',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#1a237e',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignUpScreenCustomer;
