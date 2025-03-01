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

const IMAGE_CONSTRAINTS = {
  maxWidth: 2048,
  maxHeight: 2048,
  minWidth: 512,
  minHeight: 512,
  maxSizeMB: 5,
  quality: 0.9,
  allowedFormats: ["jpeg", "jpg", "png"],
  aspectRatio: [1, 1],
};

// const validateImage = async (uri) => {
//   console.log("Validating image URI:", uri);
//   try {
//     // Check file size
//     const fileInfo = await FileSystem.getInfoAsync(uri);
//     const fileSizeMB = fileInfo.size / (1024 * 1024);
//     if (fileSizeMB > IMAGE_CONSTRAINTS.maxSizeMB) {
//       throw new Error(
//         `Image must be smaller than ${IMAGE_CONSTRAINTS.maxSizeMB}MB`
//       );
//     }

//     // Check dimensions
//     const { width, height } = await new Promise((resolve) => {
//       Image.getSize(uri, (width, height) => resolve({ width, height }));
//     });

//     if (
//       width > IMAGE_CONSTRAINTS.maxWidth ||
//       height > IMAGE_CONSTRAINTS.maxHeight
//     ) {
//       throw new Error(
//         `Image dimensions must not exceed ${IMAGE_CONSTRAINTS.maxWidth}x${IMAGE_CONSTRAINTS.maxHeight}`
//       );
//     }

//     if (
//       width < IMAGE_CONSTRAINTS.minWidth ||
//       height < IMAGE_CONSTRAINTS.minHeight
//     ) {
//       throw new Error(
//         `Image must be at least ${IMAGE_CONSTRAINTS.minWidth}x${IMAGE_CONSTRAINTS.minHeight}`
//       );
//     }

//     return true;
//   } catch (error) {
//     Alert.alert("Image Validation Failed", error.message);
//     return false;
//   }
// };

const Stack = createNativeStackNavigator();

export default function GemRegister1() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="GemRegister1Main"
        component={GemRegister1Main}
        options={{
          header: () => <Header_1 title="Add Gem" />,
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
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCameraPress = () => {
    setModalVisible(true);
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImageCropPicker.openCamera({
        width: 600,
        height: 600,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        cropping: true,
        cropperCircleOverlay: false,
        cropperStatusBarColor: "#9CCDDB",
        cropperToolbarColor: "#9CCDDB",
      });

      if (result && result.path) {
        setForm((prev) => ({ ...prev, photos: [result.path] }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 600,
        height: 600,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        cropping: true,
        cropperCircleOverlay: false,
        cropperStatusBarColor: "#9CCDDB",
        cropperToolbarColor: "#9CCDDB",
      });

      if (result && result.path) {
        setForm((prev) => ({ ...prev, photos: [result.path] }));
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
  const [shapeItems, setShapeItems] = useState([
    { label: "Round", value: "round" },
    { label: "Baguette Cut", value: "baguette" },
    { label: "Cabochon", value: "cabochon" },
    { label: "Cushion", value: "cushion" },
    { label: "Emerald Cut", value: "emerald" },
    { label: "Heart Shape", value: "heart" },
    { label: "Hexagonal Cut", value: "hexagonal" },
    { label: "Marquise", value: "marquise" },
    { label: "Oval", value: "oval" },
    { label: "Pear", value: "pear" },
    { label: "Princess Cut", value: "princess" },
    { label: "Radiant Cut", value: "radiant" },
    { label: "Rose Cut", value: "rose" },
    { label: "Trillion Cut", value: "trillion" },
  ]);

  const [form, setForm] = useState({
    color: "",
    gemShape: "",
    description: "",
    photos: [],
  });
  const [cameraVisible, setCameraVisible] = useState(false);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleContinue = () => {
    if (!form.color || !form.gemShape) {
      Alert.alert(
        "Fill Required Details",
        "Please fill in the required details marked by '*'."
      );
      return;
    }
    console.log("Data passed to GemRegister1:", form);
    navigation.navigate("GemRegister2", {
      formData: { ...form, photo: form.photos[0] },
    }); // Pass the image path
  };

  return (
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
              style={styles.buttonContainer}
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
              Below details can be filled with image of the gem or by mannually
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
            setItems={setShapeItems}
            placeholder="Select Gem Shape *"
            style={FormFieldStyles.dropdown}
            dropDownContainerStyle={FormFieldStyles.dropdownContainer}
            listItemContainerStyle={FormFieldStyles.listItemContainer}
            listItemLabelStyle={FormFieldStyles.listItemLabel}
            placeholderStyle={FormFieldStyles.placeholder}
            textStyle={FormFieldStyles.dropdownText}
            theme="LIGHT"
            showArrowIcon={true}
            showTickIcon={false} // Add this line
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />
          <TextInput
            style={[FormFieldStyles.input, styles.descriptionInput]}
            placeholder="Description"
            value={form.description}
            onChangeText={(value) => handleInputChange("description", value)}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              baseScreenStyles.blueButton,styles.blueButton,
              { opacity: form.color && form.gemShape ? 1 : 0.5 },
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
  );
}

const styles = StyleSheet.create({
 
  finalizeButton: {
    backgroundColor: "#170969",
    padding: 10,
    borderRadius: 5,
  },

  buttonContainer: {
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
  helperText: {
    color: "grey",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
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
