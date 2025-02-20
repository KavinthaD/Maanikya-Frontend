//Screen creator: Dulith

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { baseScreenStyles } from "../styles/baseStyles";

const Login3 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('business account');

  return (
    <View style={[baseScreenStyles.container,styles.container]}>
      <Image source={require('../assets/logo-gem.png')} style={styles.logo} />
      <Text style={styles.title}>Maanikya</Text>
      <Text style={styles.loginText}>Login</Text>
      <Text style={styles.instructionText}>Enter your email to Login for this app</Text>
      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Picker
        selectedValue={accountType}
        style={styles.picker}
        onValueChange={(itemValue) => setAccountType(itemValue)}
      >
        <Picker.Item label="business account" value="business account" />
        <Picker.Item label="Cutter/Burner account" value="Cutter/Burner account" />
        <Picker.Item label="customer account" value="customer account" />
      </Picker>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White color with 80% opacity
  },
  picker: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#000080',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login3;
