//Screen creator: Dulith

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-gem.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Choose your role" value="" />
          <Picker.Item label="Gem business owner" value="gem_business_owner" />
          <Picker.Item label="Cutter/Burner" value="cutter_burner" />
          <Picker.Item label="Customer" value="customer" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
    fontSize: 33,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  prompt: {
    fontSize: 18,
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
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    height: 54,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  pickerItem: {
    color: '#888',
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

export default Login;
