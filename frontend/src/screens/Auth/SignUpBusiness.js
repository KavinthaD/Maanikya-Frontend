//Screen creator: Dulith

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { baseScreenStyles } from "../../styles/baseStyles";

const SignUpBusiness = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = () => {
    // Validate inputs
    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      setErrorMessage("All fields are required.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    setErrorMessage("");

    navigation.navigate('SignUpBusiness2');
  };

  return (
    <View style={[baseScreenStyles.container]}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>Sign Up</Text>
      <Text style={styles.prompt}>Create your business Account</Text> 
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#888"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
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
          <Picker.Item label="Cutter" value="cutter" />
          <Picker.Item label="Burner" value="burner" />
          <Picker.Item label="Electric Burner" value="electric_burner" />
          </Picker>
      </View>
      {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
     <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    paddingTop:160,
    width: 170,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  prompt: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  inputHalf: {
    width: '48%',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 40,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#000080',
    borderRadius: 5,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default SignUpBusiness;
