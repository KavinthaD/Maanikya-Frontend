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
  Modal,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { baseScreenStyles } from "../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header_1 from "../components/Header_1";
import Header_2 from "../components/Header_2";
import Gem_register_2 from "./GemRegister2";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomCamera from "../components/CustomCamera";
import { Camera } from "expo-camera";
import DropDownPicker from "react-native-dropdown-picker";
import { FormFieldStyles } from "../styles/FormFields";
import * as ImagePicker from "expo-image-picker";

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
  const handleCameraPress = async () => {
    try {
      Alert.alert("Select Image", "Choose an option", [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permission needed", "Camera permission is required");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
              const newPhotos = [...form.photos, result.assets[0].uri];
              setForm((prev) => ({ ...prev, photos: newPhotos }));
            }
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission needed",
                "Gallery permission is required"
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
              const newPhotos = [...form.photos, result.assets[0].uri];
              setForm((prev) => ({ ...prev, photos: newPhotos }));
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error handling image selection:", error);
      Alert.alert("Error", "Failed to handle image selection");
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
    navigation.navigate("GemRegister2", { formData: form }); // Pass the entire form object
  };

  return (
    <View style={baseScreenStyles.container}>
      <View style={FormFieldStyles.innerContainer}>
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
            baseScreenStyles.blueButton,
            { opacity: form.color && form.gemShape ? 1 : 0.5 },
          ]}
          onPress={handleContinue}
        >
          <Text style={baseScreenStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Camera Component */}
      {cameraVisible && (
        <CustomCamera
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setCameraVisible(false)}
          onError={handleCameraError}
        />
      )}
    </View>
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
    marginBottom: 80,
    alignItems: "center",
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
});
