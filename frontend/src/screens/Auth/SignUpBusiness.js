//Screen creator: Dulith  // signup business

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";

const THEME_COLOR = '#9CCDDB';

const SignUpBusiness = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    accountType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = () => {
    // Validation logic remains the same
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.role
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    setErrorMessage("");

    // **Role Mapping for Backend:**
    let backendRole = "";
    if (form.role === "gem_business_owner") {
      backendRole = "Gem business owner";
      setForm((prev) => ({ ...prev, accountType: "business" }));
    } else if (form.role === "cutter" || form.role === "burner" || form.role === "electric_burner") {
      backendRole = form.role.charAt(0).toUpperCase() + form.role.slice(1);
      setForm((prev) => ({ ...prev, accountType: "worker" }));
    } else {
      Alert.alert("Please select a role.");
      return;
    }

    // Prepare form data to pass
    const formData = {
      ...form,
      role: backendRole,
    };

    console.log("Form data passed: ", formData);
    // Navigate to SignUpBusiness2 and pass the form data
    navigation.navigate("SignUpScreen", {
      formData,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>Sign Up</Text>
          <Text style={styles.prompt}>Create your business Account</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.inputHalfContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor="#999"
                  value={form.firstName}
                  onChangeText={(value) => setForm({ ...form, firstName: value })}
                />
              </View>
              
              <View style={styles.inputHalfContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor="#999"
                  value={form.lastName}
                  onChangeText={(value) => setForm({ ...form, lastName: value })}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@domain.com"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+94 71 234 5678"
                placeholderTextColor="#999"
                value={form.phone}
                onChangeText={(value) => setForm({ ...form, phone: value })}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Your Role</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.role}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setForm({ ...form, role: itemValue });
                    if (itemValue === "gem_business_owner") {
                      setForm((prev) => ({ ...prev, accountType: "business" }));
                    } else if (itemValue === "cutter" || itemValue === "burner" || itemValue === "electric_burner") {
                      setForm((prev) => ({ ...prev, accountType: "worker" }));
                    } else {
                      setForm((prev) => ({ ...prev, accountType: "" }));
                    }
                  }}
                >
                  <Picker.Item label="Choose your role" value="" color="#999" />
                  <Picker.Item label="Gem business owner" value="gem_business_owner" color="#333" />
                  <Picker.Item label="Cutter" value="cutter" color="#333" />
                  <Picker.Item label="Burner" value="burner" color="#333" />
                  <Picker.Item label="Electric Burner" value="electric_burner" color="#333" />
                </Picker>
              </View>
            </View>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 30,
    marginBottom: 0,
    resizeMode: "contain"
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  prompt: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
    width: "100%",
  },
  inputHalfContainer: {
    width: "48%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555555",
    marginBottom: 8,
    paddingLeft: 2,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333333",
  },
  errorText: {
    color: "#FF6B6B",
    marginBottom: 16,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: THEME_COLOR,
    borderRadius: 8,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignUpBusiness;
