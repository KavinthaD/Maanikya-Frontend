//Screen creator: Dulith  // signup business

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { baseScreenStyles } from "../../styles/baseStyles";
import axios from 'axios'; // Import axios
import GradientContainer from '../../components/GradientContainer';
import { API_URL, ENDPOINTS } from '../../config/api'; // Add this import

const SignUpBusiness = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleContinue = async () => { // Make handleContinue async
        // Validate inputs (frontend side validation - you already have this)
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

        // **Role Mapping for Backend:**
        let backendRole = "";
        if (role === "gem_business_owner") {
            backendRole = "Gem business owner";
        } else if (role === "cutter") {
            backendRole = "Cutter";
        } else if (role === "burner") {
            backendRole = "Burner";
        } else if (role === "electric_burner") {
            backendRole = "Electric Burner";
        } else {
            Alert.alert("Please select a role."); 
            return;
        }


        try {
            const response = await axios.post(`${API_URL}${ENDPOINTS.REGISTER_STEP1}`, { 
                firstName: firstName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phoneNumber,
                role: backendRole, // Use the mapped backend role
            });

            // **Successful Step 1 Registration:**
            console.log("Step 1 registration successful:", response.data);
            

            // **Navigate to Step 2:**
            navigation.navigate('SignUpScreen'); 

        } catch (error) {
            // **Step 1 Registration Error:**
            console.error("Step 1 registration failed:", error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.errors) {
                // Backend is sending validation errors as an array
                const errorList = error.response.data.errors.map(err => err.msg).join("\n");
                setErrorMessage("Registration failed:\n" + errorList);
            } else if (error.response && error.response.data && error.response.data.error) {
                // Backend is sending a single error message
                setErrorMessage("Registration failed: " + error.response.data.error);
            }
            else {
                setErrorMessage("Step 1 registration failed. Please try again."); // Generic error message
            }
        }
    };

    return (
        <GradientContainer>
        <View style={[baseScreenStyles.container]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <Text style={styles.subtitle}>Sign Up</Text>
                <Text style={styles.prompt}>Create your business Account</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="First Name"
                        placeholderTextColor="#fff"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="Last Name"
                        placeholderTextColor="#fff"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="email@domain.com"
                    placeholderTextColor="#fff"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor="#fff"
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
        </GradientContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        paddingTop: 160,
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
        borderColor: 'rgba(92, 125, 134, 0.7) ',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(92, 125, 134, 0.7) ',
        
       
    },
    inputHalf: {
        width: '48%',
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderColor: 'rgba(92, 125, 134, 0.7) ',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 40,
        overflow: 'hidden',
        backgroundColor: 'rgba(92, 125, 134, 0.7) ',
    },
    picker: {
        height: '100%',
        width: '100%',
        color: '#FFFFFF',
    },
    pickerItem: {
        color: '#888',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    continueButton: {
        backgroundColor: '#7FACBB',
        borderRadius: 5,
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: '#000',
        fontSize: 16,
    },

});

export default SignUpBusiness;