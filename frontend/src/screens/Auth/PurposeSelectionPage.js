//Screen creator: Thulani
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import { Ionicons } from "@expo/vector-icons";


const PurposeSelectionPage = ({ navigation }) => {
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [languageOptions] = useState([
      { label: "English", value: "en" },
      { label: "සිංහල", value: "si" }
    ]);

  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 880,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
        <SafeAreaView style={baseScreenStyles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={baseScreenStyles.colors.background} />
          
          <View style={baseScreenStyles.headerContainer}>
            <baseScreenStyles.LanguageSelector
              selectedLanguage={selectedLanguage}
              onPress={() => setShowLanguageModal(true)}
            />
          </View>
    
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require("../../assets/logo-gem.png")}
              style={[styles.logoIcon, { transform: [{ scale: scaleValue }] }]}
            />
            <Image
              source={require("../../assets/logo-letter.png")}
              style={styles.logoText}
            />
          </View>
    
          <Text style={styles.welcomeTitle}>Welcome to Maanikya</Text>
          <Text style={[baseScreenStyles.title,styles.title]}>I'm here to...</Text>
    
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={baseScreenStyles.purposeButton}
              onPress={() => navigation.navigate("SignUpBusiness")}
            >
              <View style={[baseScreenStyles.purposeIconContainer, baseScreenStyles.primaryIconBg]}>
                <Ionicons name="briefcase-outline" size={28} color="#FFFFFF" />
              </View>
              <View style={baseScreenStyles.purposeTextContainer}>
                <Text style={baseScreenStyles.purposeButtonTitle}>Manage My Business</Text>
                <Text style={baseScreenStyles.purposeButtonSubtitle}>Register as a gem business or worker</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={baseScreenStyles.colors.text.light} />
            </TouchableOpacity>
    
            <TouchableOpacity
              style={baseScreenStyles.purposeButton}
              onPress={() => navigation.navigate("RegisterSelectionPage")}
            >
              <View style={[baseScreenStyles.purposeIconContainer, baseScreenStyles.accentIconBg]}>
                <Ionicons name="search-outline" size={28} color="#FFFFFF" />
              </View>
              <View style={baseScreenStyles.purposeTextContainer}>
                <Text style={baseScreenStyles.purposeButtonTitle}>Look for Gems</Text>
                <Text style={baseScreenStyles.purposeButtonSubtitle}>Register as a customer to browse gems</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={baseScreenStyles.colors.text.light} />
            </TouchableOpacity>
    
            <baseScreenStyles.Divider text="OR" />
    
            <TouchableOpacity
              style={baseScreenStyles.outlinedButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={baseScreenStyles.outlinedButtonText}>Login to Your Account</Text>
            </TouchableOpacity>
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
  title: {
    textAlign: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 34,
    marginBottom: 34,
  },
  logoIcon: {
    width: 120,
    height: 80,
    resizeMode: "contain",
  },
  logoText: {
    width: 240,
    height: 60,
    resizeMode: "contain",
    marginTop: -12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: baseScreenStyles.colors.text.medium,
    textAlign: "center",
    marginTop: 12,
  },
  contentContainer: {
    paddingHorizontal: 24,
  }
});

export default PurposeSelectionPage;
