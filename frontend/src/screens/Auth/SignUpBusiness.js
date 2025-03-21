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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { baseScreenStyles } from "../../styles/baseStyles";

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
    // Validation logic
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

    // Role Mapping for Backend
    let backendRole = "";
    if (form.role === "gem_business_owner") {
      backendRole = "Gem business owner";
      setForm((prev) => ({ ...prev, accountType: "business" }));
    } else if (
      form.role === "cutter" ||
      form.role === "burner" ||
      form.role === "electric_burner"
    ) {
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
    <SafeAreaView style={baseScreenStyles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={baseScreenStyles.colors.background}
      />

      <ScrollView
        contentContainerStyle={baseScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={baseScreenStyles.contentContainer}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={baseScreenStyles.colors.primary}
              />
            </TouchableOpacity>

            <View style={baseScreenStyles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={baseScreenStyles.logo}
              />
            </View>
          </View>

          <Text style={baseScreenStyles.title}>Create Account</Text>
          <Text style={baseScreenStyles.subtitle}>
            Enter your personal details
          </Text>

          <View style={baseScreenStyles.formContainer}>
            <View style={baseScreenStyles.row}>
              <View style={baseScreenStyles.halfWidth}>
                <Text style={baseScreenStyles.label}>First Name</Text>
                <View style={baseScreenStyles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#888"
                    style={baseScreenStyles.inputIcon}
                  />
                  <TextInput
                    style={baseScreenStyles.input}
                    placeholder="John"
                    placeholderTextColor={
                      baseScreenStyles.colors.input.placeholder
                    }
                    value={form.firstName}
                    onChangeText={(value) =>
                      setForm({ ...form, firstName: value })
                    }
                  />
                </View>
              </View>

              <View style={baseScreenStyles.halfWidth}>
                <Text style={baseScreenStyles.label}>Last Name</Text>
                <View style={baseScreenStyles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#888"
                    style={baseScreenStyles.inputIcon}
                  />
                  <TextInput
                    style={baseScreenStyles.input}
                    placeholder="Doe"
                    placeholderTextColor={
                      baseScreenStyles.colors.input.placeholder
                    }
                    value={form.lastName}
                    onChangeText={(value) =>
                      setForm({ ...form, lastName: value })
                    }
                  />
                </View>
              </View>
            </View>

            <Text style={baseScreenStyles.label}>Email</Text>
            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="example@domain.com"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={baseScreenStyles.label}>Phone Number</Text>
            <View style={baseScreenStyles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="+94 71 796 6745"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.phone}
                onChangeText={(value) => setForm({ ...form, phone: value })}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={baseScreenStyles.label}>Select Your Role</Text>
            <View
              style={[baseScreenStyles.inputWrapper, { paddingVertical: 0 }]}
            >
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#888"
                style={baseScreenStyles.inputIcon}
              />
              <View style={baseScreenStyles.pickerContainer}>
                <Picker
                  selectedValue={form.role}
                  style={[
                    baseScreenStyles.picker,
                    {
                      color: form.role
                        ? baseScreenStyles.colors.text.dark
                        : baseScreenStyles.colors.input.placeholder,
                    },
                  ]}
                  onValueChange={(itemValue) => {
                    setForm({ ...form, role: itemValue });
                    if (itemValue === "gem_business_owner") {
                      setForm((prev) => ({ ...prev, accountType: "business" }));
                    } else if (
                      itemValue === "cutter" ||
                      itemValue === "burner" ||
                      itemValue === "electric_burner"
                    ) {
                      setForm((prev) => ({ ...prev, accountType: "worker" }));
                    } else {
                      setForm((prev) => ({ ...prev, accountType: "" }));
                    }
                  }}
                >
                  <Picker.Item
                    label="Choose your role"
                    value=""
                    color={baseScreenStyles.colors.input.placeholder}
                  />
                  <Picker.Item
                    label="Gem business owner"
                    value="gem_business_owner"
                    color={baseScreenStyles.colors.text.dark}
                  />
                  <Picker.Item
                    label="Cutter"
                    value="cutter"
                    color={baseScreenStyles.colors.text.dark}
                  />
                  <Picker.Item
                    label="Burner"
                    value="burner"
                    color={baseScreenStyles.colors.text.dark}
                  />
                  <Picker.Item
                    label="Electric Burner"
                    value="electric_burner"
                    color={baseScreenStyles.colors.text.dark}
                  />
                </Picker>
              </View>
            </View>

            {errorMessage ? (
              <Text style={baseScreenStyles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={baseScreenStyles.primaryButton}
              onPress={handleContinue}
            >
              <Text style={baseScreenStyles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={baseScreenStyles.regularText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={baseScreenStyles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.stepIndicator}>
              <View style={styles.stepActive}></View>
              <View style={styles.stepInactive}></View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

// Only include styles specific to this component that aren't in baseScreenStyles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 0,
    position: "relative",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  stepActive: {
    width: 30,
    height: 6,
    backgroundColor: baseScreenStyles.colors.primary,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  stepInactive: {
    width: 30,
    height: 6,
    backgroundColor: "#DDD",
    borderRadius: 3,
    marginHorizontal: 4,
  },
});

export default SignUpBusiness;
