//Screen creator: Kavintha
//dev button search "dev bypass"

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew"; // Import base styles
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderBar from "../../components/HeaderBar";
import Gem_register_3 from "./GemRegister3"; // Import GemRegister3
import axios from "axios"; // Import axios
import { FormFieldStyles } from "../../styles/FormFields";
import { API_URL, ENDPOINTS } from "../../config/api"; //change api path here
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { baseScreenStyles } from "../../styles/baseStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

const Stack = createNativeStackNavigator();

export default function GemRegister2({ route }) {
  const { formData } = route.params; // Destructure formData instead of name

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GemRegister2Main"
        component={GemRegister2Main}
        initialParams={{ formData: formData }} // Pass formData to GemRegister2Main
        options={{
          header: () => <Header_2 title="Gem Register" />,
        }}
      />
      <Stack.Screen
        name="GemRegister3"
        component={Gem_register_3}
        options={{
          header: () => <Header_1 title="QR code" />,
        }}
      />
    </Stack.Navigator>
  );
}

function GemRegister2Main() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData } = route.params || {};

  const [form, setForm] = useState({
    ownerName: "",
    contactNumber: "",
    dimensions: "",
    weight: "",
    purchasePrice: "",
    extraInfo: "",
  });

  const scrollViewRef = useRef(null);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Initialize form state from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedForm = async () => {
        try {
          const savedForm = await AsyncStorage.getItem("gemRegister2Form");
          if (savedForm) {
            setForm(JSON.parse(savedForm));
          }
        } catch (error) {
          console.error("Error loading saved form:", error);
        }
      };

      loadSavedForm();
    }, [])
  );

  // Save form data whenever it changes
  useEffect(() => {
    const saveForm = async () => {
      try {
        await AsyncStorage.setItem("gemRegister2Form", JSON.stringify(form));
      } catch (error) {
        console.error("Error saving form:", error);
      }
    };

    saveForm();
  }, [form]);

  // Clear saved form data after successful submission
  const handleFinalize = async () => {
    // Check required fields
    if (!form.ownerName || !form.contactNumber || !form.purchasePrice) {
      Alert.alert(
        "Fill Required Details",
        "Please fill in the required details marked by '*'."
      );
      return;
    }

    const combinedForm = {
      ...formData, // Data from GemRegister1
      ...form, // Data from GemRegister2
    };

    console.log("Form Submitted");

    // Create FormData object
    const formDataToSend = new FormData();

    // Only append photo if it exists
    if (
      combinedForm.photo ||
      (combinedForm.photos && combinedForm.photos.length > 0)
    ) {
      const photoUri = combinedForm.photo || combinedForm.photos[0];
      formDataToSend.append("photo", {
        uri: photoUri,
        type: "image/jpeg",
        name: "gem_photo.jpg",
      });
    }

    // Append other form data
    Object.keys(combinedForm).forEach((key) => {
      if (key !== "photo" && key !== "photos" && combinedForm[key]) {
        formDataToSend.append(key, combinedForm[key]);
      }
    });

    try {
      console.log("API URL:", `${API_URL}${ENDPOINTS.REGISTER_GEM}`);
      console.log("Form Data to Send:", formDataToSend);

      // Get the token from storage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${API_URL}${ENDPOINTS.REGISTER_GEM}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type
            Authorization: `Bearer ${token}`, // Add the bearer token
          },
          timeout: 10000, // 10 second timeout
        }
      );
      // =============================================
      // === LOGGING RETURNED DATA ===================
      // console.log("Returned Data:", response.data);
      // =============================================

      if (response.status === 201) {
        console.log("Gem registered successfully:");
        await AsyncStorage.removeItem("gemRegister2Form");
        navigation.navigate("GemRegister3", {
          gemId: response.data.gem.gemId,
          createdAt: response.data.gem.createdAt,
          qrCode: response.data.gem.qrCode,
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to register gem. Please try again."
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Add dev bypass function
  const handleDevBypass = () => {
    // Create mock response data
    const mockGemData = {
      gemId: "DEV" + Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DEV-SAMPLE-QR"
    };
    
    navigation.navigate("GemRegister3", mockGemData);
  };
  
  return (
    <View style={[baseScreenStylesNew.backgroundColor,baseScreenStylesNew.container]}>
      <HeaderBar 
        title="Register Gem" 
        navigation={navigation} 
        showBack={true} 
      />
      
      {/* Dev bypass button (only in dev) */}
      {__DEV__ && (
        <TouchableOpacity 
          style={styles.devBypassButton} 
          onPress={handleDevBypass}
        >
          <Text style={styles.devBypassText}>DEV</Text>
        </TouchableOpacity>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[baseScreenStylesNew.container, { zIndex: 1 }]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 20 }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Gem Details</Text>

            {/* Owner Name Input */}
            <View style={baseScreenStyles.inputWrapper}>
              <Icon name="person" size={20} color={baseScreenStyles.colors.input.placeholder} style={styles.inputIcon} />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Gem Owner Name *"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.ownerName}
                onChangeText={(value) => handleInputChange("ownerName", value)}
              />
            </View>

            {/* Contact Number Input */}
            <View style={baseScreenStyles.inputWrapper}>
              <Icon name="phone" size={20} color={baseScreenStyles.colors.input.placeholder} style={styles.inputIcon} />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Contact Number *"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.contactNumber.toString()}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  handleInputChange("contactNumber", numericValue);
                }}
                keyboardType="phone-pad"
              />
            </View>

            {/* Dimensions Input */}
            <View style={baseScreenStyles.inputWrapper}>
              <Icon name="straighten" size={20} color={baseScreenStyles.colors.input.placeholder} style={styles.inputIcon} />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Dimensions (e.g., 9.30 x 7.30 x 4.60mm)"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.dimensions}
                onChangeText={(value) => {
                  // Allow numbers, decimal points, and the characters 'x', 'X', and '*'
                  const formattedValue = value.replace(/[^0-9.xX* ]/g, "");
                  handleInputChange("dimensions", formattedValue);
                }}
                keyboardType="default"
              />
            </View>

            {/* Weight Input */}
            <View style={baseScreenStyles.inputWrapper}>
              <Icon name="scale" size={20} color={baseScreenStyles.colors.input.placeholder} style={styles.inputIcon} />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Weight (ct)"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.weight}
                onChangeText={(value) => {
                  const numericValue = value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
                  handleInputChange("weight", numericValue);
                }}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Purchase Price Input */}
            <View style={baseScreenStyles.inputWrapper}>
              <Icon name="attach-money" size={20} color={baseScreenStyles.colors.input.placeholder} style={styles.inputIcon} />
              <TextInput
                style={baseScreenStyles.input}
                placeholder="Purchase price (LKR) *"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.purchasePrice}
                onChangeText={(value) => {
                  const numericValue = value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
                  handleInputChange("purchasePrice", numericValue);
                }}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Extra Information Input */}
            <View style={[baseScreenStyles.inputWrapper, styles.textareaWrapper]}>
              <Icon 
                name="info" 
                size={20} 
                color={baseScreenStyles.colors.input.placeholder}
                style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 12 }]} 
              />
              <TextInput
                style={[baseScreenStyles.input, styles.textareaInput]}
                placeholder="Extra Information"
                placeholderTextColor={baseScreenStyles.colors.input.placeholder}
                value={form.extraInfo}
                onChangeText={(value) => handleInputChange("extraInfo", value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
              />
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  baseScreenStyles.primaryButton, 
                  styles.finalizeButton,
                  {opacity: form.ownerName && form.contactNumber && form.purchasePrice ? 1 : 0.6}
                ]}
                onPress={handleFinalize}
                disabled={!form.ownerName || !form.contactNumber || !form.purchasePrice}
              >
                <Text style={baseScreenStyles.buttonText}>Finalize</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
    paddingBottom: 10, // Add extra padding at bottom for keyboard
    position: "relative", // Add this
  },

  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  //dev bypass button styles
  devBypassButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1000,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#721c24',
    borderStyle: 'dashed',
  },
  devBypassText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  textareaWrapper: {
    minHeight: 120,
    alignItems: 'flex-start',
  },
  textareaInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.input.border,
    bottom: -75,
  },
  backButtonText: {
    color: baseScreenStyles.colors.text.dark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalizeButton: {
    flex: 2,
    bottom: -59,
  },
});
