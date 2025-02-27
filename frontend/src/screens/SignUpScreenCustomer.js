//Screen creator: Dulith

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { baseScreenStyles } from "../styles/baseStyles";

const SignUpScreenCustomer = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>Sign Up</Text>
      <Text style={styles.instructions}>Create Your Customer Account</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="First Name"placeholderTextColor="#888" />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Last Name"placeholderTextColor="#888" />
      </View>
      <TextInput style={styles.input} placeholder="email@domain.com" keyboardType="email-address"placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad"placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="User Name"placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Password"placeholderTextColor="#888" secureTextEntry />
      <TextInput style={styles.input} placeholder="Re-enter password"placeholderTextColor="#888" secureTextEntry />
      <TouchableOpacity style={styles.button}>
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
    width: 150,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight:'bold'
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    fontWeight:'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    opacity: 0.8, 
  },
  halfInput: {
    width: '48%',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#000080',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignUpScreenCustomer;
