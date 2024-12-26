import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
// Import the logo image 
import logo from './assets/logo.png';
const App = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Welcome to Maanikya!</Text>
      <Text style={styles.subtitle}>Create your customer account</Text>

      <TextInput 
        style={styles.input} 
        placeholder="First Name" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Last Name" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone number" 
        keyboardType="phone-pad" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="User Name" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry={true} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Re-enter Password" 
        secureTextEntry={true} 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => Alert.alert('Account Created', 'Your account has been successfully created!')}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <Button 
        title="Continue with Google" 
        onPress={() => Alert.alert('Google Sign-In', 'Google Sign-In button pressed!')} 
      />
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D4E7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: { 
    width: 100,  
    height: 100, 
    marginBottom: 20, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003C6A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003C6A',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
  },
  button: {
    backgroundColor: '#003C6A',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
    fontSize: 14,
    color: '#003C6A',
  },
});

export default App;
