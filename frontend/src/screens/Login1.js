import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Login1 = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-gem.png')} style={styles.logo} />
      <Text style={styles.title}>Maanikya</Text>
      <Text style={styles.subtitle}>Login</Text>
      <Text style={styles.prompt}>Enter your email to Login for this app</Text>
      <TextInput
        style={[styles.input, styles.inputWithOpacity, {textAlign: 'left'}]}
        placeholder="email@domain.com"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.inputWithOpacity, {textAlign: 'left'}]}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity>
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
    width: 100,
    height: 100,
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
  forgotPassword: {
    color: '#007bff',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 195,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login1;
