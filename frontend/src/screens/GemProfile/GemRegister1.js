//Screen creator: Kavintha
//dev button search "bypass"
import React, { useState, useEffect } from "react";
import {
  Linking,
  PermissionsAndroid,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderBar from "../../components/HeaderBar";
import Gem_register_2 from "./GemRegister2";
import Icon from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { FormFieldStyles } from "../../styles/FormFields";
import Modal from "react-native-modal";
import ImageCropPicker from "react-native-image-crop-picker";
import { gemTypeItems } from "./gemTypes"; // Import gem types from gemTypes.js
import axios from "axios";
import { API_URL } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";

// Update IMAGE_CONSTRAINTS
const IMAGE_CONSTRAINTS = {
  maxWidth: 2048, // Maximum 2K resolution
  maxHeight: 2048, // Maximum 2K resolution
  minWidth: 300, // Minimum 300px for decent detail
  minHeight: 300, // Minimum 300px for decent detail
  maxSizeMB: 15, // Increased to 15MB before rejection
  quality: 0.9, // Initial quality
  allowedFormats: ["jpeg", "jpg", "png"],
  aspectRatio: [1, 1], // Square images for consistency
};

const Stack = createNativeStackNavigator();

// Add gem shapes array
const shapeItems = [
  { label: "Bar", value: "bar" },
  { label: "Dot", value: "dot" },
  { label: "Heart", value: "heart" },
  { label: "Marquise", value: "marquise" },
  { label: "Oval", value: "oval" },
  { label: "Pear", value: "pear" },
  { label: "Round", value: "round" },
  { label: "Square", value: "square" },
  { label: "Triangle", value: "triangle" },
  { label: "Uncut", value: "uncut" },
];

export default function GemRegister1() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="GemRegister1Main"
        component={GemRegister1Main}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GemRegister2"
        component={Gem_register_2}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function GemRegister1Main() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Add this near the top of your component function (GemRegister1Main)
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // success, error, info
  });

  // Add this function to show toast messages
  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      message,
      type,
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "This app needs camera and gallery access to get Gem image. Pleasse go to settings and enable permissions for camera",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
      setHasPermission(status === "granted");
      setModalVisible(true);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert(
        "Error",
        "Failed to request camera permissions. Please try again."
      );
    }
  };

  // Add image validation function
  const validateImage = async (imageResult) => {
    try {
      const fileSizeMB = imageResult.size / (1024 * 1024);

      const validationResults = {
        isValid: true,
        errors: [],
        needsCompression: false,
      };

      // Check minimum dimensions
      if (
        imageResult.width < IMAGE_CONSTRAINTS.minWidth ||
        imageResult.height < IMAGE_CONSTRAINTS.minHeight
      ) {
        validationResults.isValid = false;
        validationResults.errors.push(
          `Image must be at least ${IMAGE_CONSTRAINTS.minWidth}x${IMAGE_CONSTRAINTS.minHeight} pixels`
        );
      }

      // Check if file is extremely large
      if (fileSizeMB > IMAGE_CONSTRAINTS.maxSizeMB) {
        validationResults.isValid = false;
        validationResults.errors.push(
          `Image file is too large (${fileSizeMB.toFixed(
            1
          )}MB). Maximum allowed size is ${IMAGE_CONSTRAINTS.maxSizeMB}MB`
        );
      }

      return validationResults;
    } catch (error) {
      console.error("Image validation error:", error);
      return {
        isValid: false,
        errors: ["Failed to validate image"],
        needsCompression: false,
      };
    }
  };

  // Update handleAIAnalysis function to handle failures better

  const handleAIAnalysis = async (imageInfo) => {
    try {
      console.log("Image Stats before API call:", {
        width: imageInfo.width,
        height: imageInfo.height,
        size: `${(imageInfo.size / (1024 * 1024)).toFixed(2)}MB`,
        mime: imageInfo.mime,
      });

      // Validate image before processing
      const validationResult = await validateImage(imageInfo);
      if (!validationResult.isValid) {
        Alert.alert("Invalid Image", validationResult.errors.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }

      // Update the form with the image regardless of AI analysis success
      setForm((prev) => ({
        ...prev,
        photos: [imageInfo.path],
      }));

      // Show loading message
      setIsLoading(true);
      setLoadingMessage("Analyzing image with AI...");

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("image", {
        uri:
          Platform.OS === "ios"
            ? imageInfo.path.replace("file://", "")
            : imageInfo.path,
        type: "image/jpeg",
        name: "gem_image.jpg",
      });

      // Set a timeout to prevent long waits
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("AI analysis request timed out")),
          20000
        )
      );

      // Try AI analysis with a timeout
      const response = await Promise.race([
        axios.post(`${API_URL}/api/ai/analyze`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }),
        timeoutPromise,
      ]);

      console.log("Raw API Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        const analysis = response.data.analysis;

        // Find the matching gem type in gemTypeItems
        const matchingGemType =
          gemTypeItems.find((item) => item.label === analysis.gemTypes[0])
            ?.value || analysis.gemTypes[0];

        // Auto-fill the form with AI analysis results
        setForm((prev) => ({
          ...prev,
          color: analysis.color.name,
          gemShape: analysis.shape.toLowerCase(),
          gemType: matchingGemType,
          description: analysis.description,
        }));

        showToast("AI suggestions applied! You can modify them if needed.");
      }
    } catch (error) {
      console.error("AI Analysis error:", error);

      // The important part: don't remove the image if AI fails
      // Just inform the user and let them continue manually
      showToast(
        "Image added but AI analysis failed. Please fill manually.",
        "error"
      );

      // We don't need to clear the image here - it's already set in the form
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleTakePhoto and handleChooseFromGallery configurations
  const imagePickerConfig = {
    width: IMAGE_CONSTRAINTS.maxWidth,
    height: IMAGE_CONSTRAINTS.maxHeight,
    mediaType: "photo",
    includeBase64: false,
    cropping: true,
    cropperCircleOverlay: false,
    cropperStatusBarColor: baseScreenStyles.colors.primary || "#170969",
    cropperToolbarColor: baseScreenStyles.colors.primary || "#170969",
    cropperToolbarWidgetColor: "#FFFFFF",
    compressImageQuality: IMAGE_CONSTRAINTS.quality,
    compressImageMaxWidth: IMAGE_CONSTRAINTS.maxWidth,
    compressImageMaxHeight: IMAGE_CONSTRAINTS.maxHeight,
    forceJpg: true, // Convert all images to JPG for better compression
  };

  // Update handleTakePhoto for better error handling
  const handleTakePhoto = async () => {
    try {
      const result = await ImageCropPicker.openCamera(imagePickerConfig);
      if (result) {
        const validation = await validateImage(result);
        if (!validation.isValid) {
          Alert.alert("Invalid Image", validation.errors.join("\n"));
          return;
        }

        // Always update the form with the image
        setForm((prev) => ({
          ...prev,
          photos: [result.path],
        }));

        // Try AI analysis but don't block on failure
        try {
          await handleAIAnalysis(result);
        } catch (aiError) {
          console.error(
            "AI analysis failed but continuing with image:",
            aiError
          );
          Alert.alert(
            "AI Analysis Failed",
            "The image has been added but couldn't be analyzed. Please fill the form manually."
          );
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      if (error.message !== "User cancelled image selection") {
        Alert.alert("Error", "Failed to take photo. Please try again.");
      }
    } finally {
      setModalVisible(false);
    }
  };

  // Update handleChooseFromGallery for better error handling
  const handleChooseFromGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker(imagePickerConfig);
      if (result) {
        const validation = await validateImage(result);
        if (!validation.isValid) {
          Alert.alert("Invalid Image", validation.errors.join("\n"));
          return;
        }

        // Always update the form with the image
        setForm((prev) => ({
          ...prev,
          photos: [result.path],
        }));

        // Try AI analysis but don't block on failure
        try {
          await handleAIAnalysis(result);
        } catch (aiError) {
          console.error(
            "AI analysis failed but continuing with image:",
            aiError
          );
          Alert.alert(
            "AI Analysis Failed",
            "The image has been added but couldn't be analyzed. Please fill the form manually."
          );
        }
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
      if (error.message !== "User cancelled image selection") {
        Alert.alert(
          "Error",
          "Failed to select image from gallery. Please try again."
        );
      }
    } finally {
      setModalVisible(false);
    }
  };

  const navigation = useNavigation();

  // For gem shape dropdown
  const [openShape, setOpenShape] = useState(false);

  // For gem type dropdown
  const [openGemType, setOpenGemType] = useState(false);

  const [form, setForm] = useState({
    color: "",
    gemShape: "",
    gemType: "",
    description: "",
    photos: [],
  });
  const [cameraVisible, setCameraVisible] = useState(false);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleContinue = () => {
    if (!form.color || !form.gemShape || !form.gemType) {
      Alert.alert(
        "Fill Required Details",
        "Please fill in the required details marked by '*'."
      );
      return;
    }

    // Log image details before navigation
    if (form.photos[0]) {
      console.log("Image Stats passed to GemRegister2:", {
        path: form.photos[0],
        formData: form,
      });
    }
    navigation.navigate("GemRegister2", {
      formData: { ...form, photo: form.photos[0] },
    }); // Pass the image path
  };

  // Add dev bypass function (dev bypass)
  // const handleDevBypass = () => {
  //   // Create mock data
  //   const mockFormData = {
  //     color: form.color || "Blue",
  //     gemShape: form.gemShape || "round",
  //     gemType: form.gemType || "sapphire",
  //     description: form.description || "Development test gem",
  //     photos: form.photos.length > 0 ? form.photos : [],
  //     photo: form.photos.length > 0 ? form.photos[0] : null
  //   };

  //   // Navigate to next screen
  //   navigation.navigate("GemRegister2", {
  //     formData: mockFormData,
  //   });
  // };

  return (
    <View style={baseScreenStylesNew.container}>
      <HeaderBar title="Register Gem" />

      {/* Dev bypass button (only in dev) */}
      {/* {__DEV__ && (
        <TouchableOpacity 
          style={styles.devBypassButton} 
          onPress={handleDevBypass}
        >
          <Text style={styles.devBypassText}>DEV</Text>
        </TouchableOpacity>
      )} */}

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={baseScreenStyles.colors.primary}
          />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[baseScreenStylesNew.container]}  // Remove zIndex: 1
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* Camera/AI Section */}
            <View style={styles.cameraSection}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraPress}
              >
                {form.photos.length > 0 ? (
                  <Image
                    source={{ uri: form.photos[0] }}
                    style={styles.selectedImage}
                  />
                ) : (
                  <View style={styles.cameraIconContainer}>
                    <Icon
                      name="camera-alt"
                      size={40}
                      color={baseScreenStyles.colors.background}
                    />
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>AI Auto-Fill</Text>

              <Text style={styles.helperText}>
                Take a photo to let AI analyze and auto-fill gem details. (Be
                aware that AI analysis may not always be accurate.)
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Color Input */}
              <View style={baseScreenStyles.inputWrapper}>
                <Icon
                  name="palette"
                  size={20}
                  color={baseScreenStyles.colors.input.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={baseScreenStyles.input}
                  placeholder="Gem color *"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  value={form.color}
                  onChangeText={(value) => handleInputChange("color", value)}
                />
              </View>

              {/* Gem Shape Dropdown */}
              <View style={[styles.dropdownWrapper]}>
                <Icon
                  name="category"
                  size={20}
                  color={baseScreenStyles.colors.input.placeholder}
                  style={styles.dropdownIcon}
                />
                <DropDownPicker
                  open={openShape}
                  value={form.gemShape}
                  items={shapeItems}
                  setOpen={(isOpen) => {
                    // Close the other dropdown if opening this one
                    if (isOpen && openGemType) setOpenGemType(false);
                    setOpenShape(isOpen);
                  }}
                  setValue={(callback) =>
                    handleInputChange("gemShape", callback())
                  }
                  placeholder="Select Gem Shape *"
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  dropDownContainerStyle={
                    Platform.OS === "android"
                      ? {
                          backgroundColor: "#fff",
                          position: "relative",
                          top: 0,
                          borderColor: baseScreenStyles.colors.input.border,
                          borderWidth: 1,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }
                      : {
                          backgroundColor: "#fff",
                          borderColor: baseScreenStyles.colors.input.border,
                          borderWidth: 1,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }
                  }
                  placeholderStyle={styles.placeholderStyle}
                  listItemLabelStyle={styles.listItemLabelStyle}
                  textStyle={styles.dropdownTextStyle}
                  arrowIconStyle={styles.arrowIconStyle}
                  showArrowIcon={true}
                  showTickIcon={true}
                  listMode={Platform.OS === "android" ? "MODAL" : "DROPDOWN"}
                  maxHeight={200}
                  modalContentContainerStyle={{
                    backgroundColor: "#fff",
                    padding: 0,
                    borderRadius: 12,
                  }}
                  modalProps={{
                    transparent: true,
                    presentationStyle: "overFullScreen",
                  }}
                  searchable={false}
                />
              </View>

              {/* Gem Type Dropdown */}
              <View style={[styles.dropdownWrapper]}>
                <Icon
                  name="diamond"
                  size={20}
                  color={baseScreenStyles.colors.input.placeholder}
                  style={styles.dropdownIcon}
                />
                <DropDownPicker
                  open={openGemType}
                  value={form.gemType}
                  items={gemTypeItems}
                  setOpen={(isOpen) => {
                    if (isOpen && openShape) setOpenShape(false);
                    setOpenGemType(isOpen);
                  }}
                  setValue={(callback) =>
                    handleInputChange("gemType", callback())
                  }
                  placeholder="Select Gem Type *"
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  dropDownContainerStyle={
                    Platform.OS === "android"
                      ? {
                          backgroundColor: "#fff",
                          position: "relative",
                          top: 0,
                          borderColor: baseScreenStyles.colors.input.border,
                          borderWidth: 1,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }
                      : {
                          backgroundColor: "#fff",
                          borderColor: baseScreenStyles.colors.input.border,
                          borderWidth: 1,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }
                  }
                  placeholderStyle={styles.placeholderStyle}
                  listItemLabelStyle={styles.listItemLabelStyle}
                  textStyle={styles.dropdownTextStyle}
                  arrowIconStyle={styles.arrowIconStyle}
                  showArrowIcon={true}
                  showTickIcon={true}
                  listMode={Platform.OS === "android" ? "MODAL" : "DROPDOWN"}
                  maxHeight={200}
                  modalContentContainerStyle={{
                    backgroundColor: "#fff",
                    padding: 0,
                    borderRadius: 12,
                  }}
                  modalProps={{
                    transparent: true,
                    presentationStyle: "overFullScreen",
                  }}
                  searchable={true}
                  searchPlaceholder="Search gem types..."
                />
              </View>

              {/* Description Input */}
              <View
                style={[baseScreenStyles.inputWrapper, styles.textareaWrapper]}
              >
                <Icon
                  name="description"
                  size={20}
                  color={baseScreenStyles.colors.input.placeholder}
                  style={[
                    styles.inputIcon,
                    { alignSelf: "flex-start", marginTop: 12 },
                  ]}
                />
                <TextInput
                  style={[baseScreenStyles.input, styles.textareaInput]}
                  placeholder="Description"
                  placeholderTextColor={
                    baseScreenStyles.colors.input.placeholder
                  }
                  value={form.description}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                baseScreenStyles.primaryButton,
                {
                  opacity:
                    form.color && form.gemShape && form.gemType ? 1 : 0.6,
                },
              ]}
              onPress={handleContinue}
              disabled={!form.color || !form.gemShape || !form.gemType}
            >
              <Text style={baseScreenStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection="down"
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTakePhoto}
            >
              <Icon name="camera-alt" size={24} color="#170969" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChooseFromGallery}
            >
              <Icon name="photo-library" size={24} color="#170969" />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Add the Toast component to your return statement, right before the closing View tag */}
        {toast.visible && (
          <View
            style={[
              styles.toastContainer,
              toast.type === "success"
                ? styles.successToast
                : toast.type === "error"
                ? styles.errorToast
                : styles.infoToast,
            ]}
          >
            <Icon
              name={
                toast.type === "success"
                  ? "check-circle"
                  : toast.type === "error"
                  ? "error"
                  : "info"
              }
              size={24}
              color="#fff"
              style={styles.toastIcon}
            />
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  cameraSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  cameraButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: baseScreenStyles.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cameraIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 14,
    color: baseScreenStyles.colors.text.medium,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formFields: {
    marginTop: 10,
    marginBottom: 20,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.input.border,
    borderRadius: 12,
    backgroundColor: baseScreenStyles.colors.input.background,
    marginBottom: 16,
    height: 50,
    position: "relative",
  },
  dropdownIcon: {
    marginLeft: 12,
    marginRight: 8,
    position: "absolute",
    zIndex: 10, 
    left: 0,
  },
  dropdown: {
    flex: 1,
    height: 48,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingLeft: 40,
  },
  dropdownContainer: {
    width: "100%",
  },
  dropDownContainerStyle: {
    borderColor: baseScreenStyles.colors.input.border,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderStyle: {
    color: baseScreenStyles.colors.input.placeholder,
    fontSize: 16,
  },
  dropdownTextStyle: {
    color: baseScreenStyles.colors.text.dark,
    fontSize: 16,
  },
  listItemLabelStyle: {
    color: baseScreenStyles.colors.text.dark,
  },
  arrowIconStyle: {
    tintColor: baseScreenStyles.colors.input.placeholder,
  },
  textareaWrapper: {
    minHeight: 120,
    alignItems: "flex-start",
  },
  textareaInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  // Keep your existing modal styles or update them to match baseScreenStyles
  cameraButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 3,
    width: 120,
    height: 120,
    overflow: "hidden",
  },
  buttonContent: {
    marginBottom: 40,
    alignItems: "center",
    zIndex: 1,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  addPhotoButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 13,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#E8F0FE",
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 18,
    color: "#170969",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f8d7da",
  },
  cancelButtonText: {
    color: "#721c24",
  },

  //dev bypass button styles
  devBypassButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1000,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#721c24",
    borderStyle: "dashed",
  },
  devBypassText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
    fontWeight: "500",
  },
  // Toast styles
  toastContainer: {
    position: "absolute",
    bottom: 75,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 9999,
  },
  successToast: {
    backgroundColor: baseScreenStyles.colors.success || "#4CAF50",
  },
  errorToast: {
    backgroundColor: baseScreenStyles.colors.error || "#E53935",
  },
  infoToast: {
    backgroundColor: baseScreenStyles.colors.primary || "#170969",
  },
  toastText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  toastIcon: {
    marginRight: 10,
  },
});
