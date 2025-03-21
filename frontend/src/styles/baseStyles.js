import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

// Define brand colors for easy reference
const COLORS = {
  primary: "#170969",     // Main brand color (deep purple)
  accent: "#0082A7",      // Secondary color for highlights
  background: "#FFFFFF",  // Background color
  text: {
    dark: "#333333",      // Primary text
    medium: "#555555",    // Secondary text
    light: "#666666"      // Tertiary text
  },
  input: {
    background: "#F8F8F8", // Input background
    border: "#DDDDDD",     // Input border
    placeholder: "#999999" // Placeholder text
  },
  error: "#E53935",        // Error messages
  success: "#4CAF50"       // Success messages
};

// Define base styles that are common across screens
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  
  // Typography
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.light,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text.medium,
    marginBottom: 6,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  regularText: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  
  // Input styles
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.input.border,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: COLORS.input.background,
    overflow: "hidden",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text.dark,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    width: "100%",
    color: COLORS.text.dark,
  },
  eyeIcon: {
    padding: 12,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  
  // Layout helpers
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfWidth: {
    width: "48%",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Logo container
  logoContainer: {
    alignItems: "center",
    marginTop: 10,

  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  
  // Form containers
  formContainer: {
    width: "100%",
  },
  
  // Legacy support
  Button1: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    marginVertical: 16,
  },
  Button2: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: COLORS.accent,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  Button3: {
    backgroundColor: "#5a72a1",
    padding: 5,
    borderRadius: 10,
    width: "40%",
    alignSelf: "center",
  },

  // Role Selector Modal Styles
  roleSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingRight: 12,
  },
  roleSelectorText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  rolePlaceholderText: {
    fontSize: 16,
    color: COLORS.input.placeholder,
  },
  roleModal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  roleModalContent: {
    backgroundColor: COLORS.background,
    width: "80%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.dark,
    marginBottom: 16,
    textAlign: "center",
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedRoleOption: {
    backgroundColor: `${COLORS.primary}10`,
  },
  roleOptionText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
  selectedRoleOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  // Language selector styles
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F8F8F8",
  },
  languageText: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginHorizontal: 6,
  },
  
  // Divider styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: COLORS.text.light,
    fontSize: 14,
    fontWeight: "500",
  },
  
  // Welcome screen styles
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginBottom: 40,
    textAlign: "center",
  },
  
  // Purpose/option button styles
  purposeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  purposeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  primaryIconBg: {
    backgroundColor: COLORS.primary,
  },
  accentIconBg: {
    backgroundColor: COLORS.accent,
  },
  purposeTextContainer: {
    flex: 1,
  },
  purposeButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.dark,
    marginBottom: 4,
  },
  purposeButtonSubtitle: {
    fontSize: 14,
    color: COLORS.text.medium,
  },
  
  // Outlined button style (for login/secondary actions)
  outlinedButton: {
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  outlinedButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },

  // Login/register link container
  authLinkContainer: {
    flexDirection: "row",
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Export the baseScreenStyles with additional components
export const baseScreenStyles = {
  ...styles,
  colors: COLORS,
  
  // Reusable component for role selection
  RoleSelectorField: ({ role, placeholder, onPress }) => (
    <TouchableOpacity 
      style={styles.roleSelector} 
      onPress={onPress}
    >
      <Text 
        style={role ? styles.roleSelectorText : styles.rolePlaceholderText}
      >
        {role || placeholder || "Select an option"}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#888" />
    </TouchableOpacity>
  ),
  
  // Reusable modal component for role selection
  RoleSelectorModal: ({ 
    isVisible, 
    onClose, 
    title, 
    options, 
    selectedValue, 
    onSelect 
  }) => (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.roleModal}
    >
      <View style={styles.roleModalContent}>
        <Text style={styles.roleModalTitle}>{title || "Select an option"}</Text>
        {options.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.roleOption,
              selectedValue === item.value && styles.selectedRoleOption
            ]}
            onPress={() => {
              onSelect(item.value);
              onClose();
            }}
          >
            <Text 
              style={[
                styles.roleOptionText,
                selectedValue === item.value && styles.selectedRoleOptionText
              ]}
            >
              {item.label}
            </Text>
            {selectedValue === item.value && (
              <Ionicons name="checkmark" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  ),

  // Add a new reusable language selector component
  LanguageSelector: ({ selectedLanguage, onPress }) => (
    <TouchableOpacity 
      style={styles.languageButton} 
      onPress={onPress}
    >
      <Ionicons name="globe-outline" size={22} color={COLORS.text.medium} />
      <Text style={styles.languageText}>{selectedLanguage}</Text>
      <Ionicons name="chevron-down" size={18} color={COLORS.text.medium} />
    </TouchableOpacity>
  ),
  
  // Add a divider component
  Divider: ({ text }) => (
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>{text || "OR"}</Text>
      <View style={styles.divider} />
    </View>
  ),
  
  // Add an auth link component (login/signup)
  AuthLink: ({ question, linkText, onPress }) => (
    <View style={styles.authLinkContainer}>
      <Text style={styles.regularText}>{question} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  ),
};