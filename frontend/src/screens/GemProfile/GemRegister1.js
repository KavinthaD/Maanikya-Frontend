//Screen creator: Kavintha

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
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header_1 from "../../components/Header_1";
import Gem_register_2 from "./GemRegister2";
import Icon from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { FormFieldStyles } from "../../styles/FormFields";
import Modal from "react-native-modal";
import ImageCropPicker from "react-native-image-crop-picker";
import { gemTypeItems } from "./gemTypes"; // Import gem types from gemTypes.js
import axios from "axios";
import { API_URL } from "../../config/api";
import GradientContainer from "../../components/GradientContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
                { text: "Cancel", style: "cancel" }
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

  // Update handleAIAnalysis function
  const handleAIAnalysis = async (imageInfo) => {
    try {
      console.log("Image Stats before API call:", {
        width: imageInfo.width,
        height: imageInfo.height,
        size: `${(imageInfo.size / (1024 * 1024)).toFixed(2)}MB`,
        mime: imageInfo.mime,
      });

      // Validate image before processing
      const validationResult = await validateImage(imageInfo); // Changed from imagePath to imageInfo
      if (!validationResult.isValid) {
        Alert.alert("Invalid Image", validationResult.errors.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("image", {
        uri:
          Platform.OS === "ios"
            ? imageInfo.path.replace("file://", "")
            : imageInfo.path, // Changed from imagePath to imageInfo.path
        type: "image/jpeg",
        name: "gem_image.jpg",
      });

      const response = await axios.post(`${API_URL}/api/ai/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Log raw response data
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
          photos: [imageInfo.path], // Changed from imagePath to imageInfo.path
        }));

        Alert.alert(
          "AI Analysis Complete",
          "The form has been filled with AI suggestions. You can modify them if needed."
        );
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      Alert.alert(
        "AI Analysis Failed",
        error.response?.data?.message ||
          "Could not analyze the image. Please fill the form manually."
      );
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
    cropperStatusBarColor: "#9CCDDB",
    cropperToolbarColor: "#9CCDDB",
    compressImageQuality: IMAGE_CONSTRAINTS.quality,
    compressImageMaxWidth: IMAGE_CONSTRAINTS.maxWidth,
    compressImageMaxHeight: IMAGE_CONSTRAINTS.maxHeight,
    forceJpg: true, // Convert all images to JPG for better compression
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImageCropPicker.openCamera(imagePickerConfig);
      if (result) {
        const validation = await validateImage(result);
        if (!validation.isValid) {
          Alert.alert("Invalid Image", validation.errors.join("\n"));
          return;
        }
        await handleAIAnalysis(result);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker(imagePickerConfig);
      if (result) {
        const validation = await validateImage(result);
        if (!validation.isValid) {
          Alert.alert("Invalid Image", validation.errors.join("\n"));
          return;
        }
        await handleAIAnalysis(result);
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
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

  return (
    <GradientContainer>
      <Header_1 title="Add gem" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[baseScreenStyles.container, { zIndex: 1 }]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          nestedScrollEnabled={true}
        >
          <View style={[FormFieldStyles.innerContainer, { zIndex: 2 }]}>
            <View style={styles.buttonContent}>
              <TouchableOpacity
                style={styles.cameraButtonContainer}
                onPress={handleCameraPress}
              >
                {form.photos.length > 0 ? (
                  <Image
                    source={{ uri: form.photos[0] }}
                    style={styles.selectedImage}
                  />
                ) : (
                  <Icon name="camera-alt" size={60} color="#000" />
                )}
              </TouchableOpacity>
              <Text style={styles.addPhotoButtonText}>AI auto filler</Text>
              <Text style={baseScreenStyles.helperText}>
                Below details can be filled with image of the gem or by manually
                (Please be aware, AI auto filler can make mistakes.)
              </Text>
            </View>
            <TextInput
              style={FormFieldStyles.input}
              placeholder="Gem color *"
              value={form.color}
              onChangeText={(value) => handleInputChange("color", value)}
            />
            <DropDownPicker
              open={openShape}
              value={form.gemShape}
              items={shapeItems}
              setOpen={setOpenShape}
              setValue={(callback) => handleInputChange("gemShape", callback())}
              placeholder="Select Gem Shape *"
              style={FormFieldStyles.dropdown}
              dropDownContainerStyle={FormFieldStyles.dropdownContainer}
              listItemContainerStyle={FormFieldStyles.listItemContainer}
              listItemLabelStyle={FormFieldStyles.listItemLabel}
              placeholderStyle={FormFieldStyles.placeholder}
              textStyle={FormFieldStyles.dropdownText}
              theme="LIGHT"
              showArrowIcon={true}
              showTickIcon={false}
              zIndex={3000}
              zIndexInverse={2000}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
            <DropDownPicker
              open={openGemType}
              value={form.gemType}
              items={gemTypeItems}
              setOpen={setOpenGemType}
              setValue={(callback) => handleInputChange("gemType", callback())}
              placeholder="Select Gem Type *"
              style={FormFieldStyles.dropdown}
              dropDownContainerStyle={FormFieldStyles.dropdownContainer}
              listItemContainerStyle={FormFieldStyles.listItemContainer}
              listItemLabelStyle={FormFieldStyles.listItemLabel}
              placeholderStyle={FormFieldStyles.placeholder}
              textStyle={FormFieldStyles.dropdownText}
              theme="LIGHT"
              showArrowIcon={true}
              showTickIcon={false}
              zIndex={2000}
              zIndexInverse={3000}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
            <TextInput
              style={[FormFieldStyles.input, FormFieldStyles.descriptionInput]}
              placeholder="Description"
              value={form.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                baseScreenStyles.Button1,
                styles.Button1,
                {
                  opacity:
                    form.color && form.gemShape && form.gemType ? 1 : 0.5,
                },
              ]}
              onPress={handleContinue}
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
      </KeyboardAvoidingView>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  Button1: {
    marginTop: 10,
  },

  cameraButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 3,
    backgroundColor: "#E8F0FE",
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
});
