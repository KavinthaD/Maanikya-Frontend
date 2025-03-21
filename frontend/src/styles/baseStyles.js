import { StyleSheet } from "react-native";

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
    marginVertical: 40,
  },
  logo: {
    width: 140,
    height: 140,
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
});

export const baseScreenStyles = {
  ...styles,
  colors: COLORS,
};