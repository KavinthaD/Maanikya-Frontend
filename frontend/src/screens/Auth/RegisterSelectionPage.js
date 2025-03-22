//Screen creator: Thulani

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { baseScreenStyles } from "../../styles/baseStyles";
import { Ionicons } from "@expo/vector-icons";


const RegisterSelectionPage = ({ navigation }) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [languageOptions] = useState([
    { label: "English", value: "en" },
    { label: "සිංහල", value: "si" }
  ]);

  return (
    <SafeAreaView style={baseScreenStyles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={baseScreenStyles.colors.background} />
          
          <View style={styles.contentContainer}>
            <View style={baseScreenStyles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={baseScreenStyles.logo}
              />
            </View>
    
            <Text style={baseScreenStyles.welcomeText}>Welcome to Maanikya!</Text>
            <Text style={baseScreenStyles.subtitleText}>Find the perfect gem for your needs</Text>
    
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={baseScreenStyles.primaryButton}
                onPress={() => navigation.navigate("SignUpScreenCustomer")}
              >
                <Text style={baseScreenStyles.buttonText}>Create an account</Text>
              </TouchableOpacity>
    
              <baseScreenStyles.Divider text="OR" />
    
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Market")}
              >
                <Ionicons 
                  name="eye-outline" 
                  size={20} 
                  color={baseScreenStyles.colors.primary} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>Continue as a guest</Text>
              </TouchableOpacity>
            </View>
    
            <baseScreenStyles.AuthLink 
              question="Already have an account?"
              linkText="Login"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
    
          <baseScreenStyles.RoleSelectorModal
            isVisible={showLanguageModal}
            onClose={() => setShowLanguageModal(false)}
            title="Select Language"
            options={languageOptions}
            selectedValue={languageOptions.find(item => item.label === selectedLanguage)?.value}
            onSelect={(value) => {
              setSelectedLanguage(languageOptions.find(item => item.value === value)?.label || "English");
              setShowLanguageModal(false);
            }}
          />
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
  contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      marginTop: -70,
    },
    buttonContainer: {
      width: "100%",
      maxWidth: 400,
    },
    secondaryButton: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      paddingVertical: 16,
      width: "100%",
      borderRadius: 12,
      borderColor: baseScreenStyles.colors.primary,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: baseScreenStyles.colors.primary,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "600",
    },
    buttonIcon: {
      marginRight: 8,
    }
});

export default RegisterSelectionPage;
