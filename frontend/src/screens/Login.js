import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Login1 = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>Login</Text>
      <Text style={styles.prompt}>Enter your username to log in to this app</Text>
      <TextInput
        style={[styles.input, styles.inputWithOpacity, { textAlign: 'left' }]}
        placeholder="Username"
        placeholderTextColor="#888" 
      />
      <TextInput
        style={[styles.input, styles.inputWithOpacity, { textAlign: 'left' }]}
        placeholder="Password"
        placeholderTextColor="#888" 
        secureTextEntry
      />
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3e5fc',
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 5,
  },
  prompt: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputWithOpacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White color with 80% opacity
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    color: '#007bff',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#170969',
    paddingVertical: 10,
    paddingHorizontal: 195,
    borderRadius: 5,
    width: '100%',
    height: 50,
    alignItems: 'center',   
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login1;
