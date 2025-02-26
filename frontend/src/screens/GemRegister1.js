//Screen creator: Kavintha

import React, { useState, useEffect } from "react";
import {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to use this feature",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

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

  const handleCameraPress = () => {
    setCameraVisible(true); // Show the camera
  };

  const handlePhotoTaken = (uri) => {
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, uri],
    }));
    setCameraVisible(false); // Close the camera
  };

  const handleChooseFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
      selectionLimit: 0,
    });
    if (result.assets) {
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...result.assets.map((asset) => asset.uri)],
      }));
    }
  };

  // Add error handling for camera
  const handleCameraError = (error) => {
    Alert.alert(
      "Camera Error",
      "An error occurred while accessing the camera",
      [{ text: "OK" }]
    );
    setCameraVisible(false);
  };

  return (
    <View style={baseScreenStyles.container}>
      <View style={FormFieldStyles.innerContainer}>
        <View style={styles.buttonContent}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleCameraPress}
          >
            <Icon name="camera-alt" size={60} color="#000" />
          </TouchableOpacity>
          <Text style={styles.addPhotoButtonText}>AI auto filler</Text>
          <Text style={baseScreenStyles.helperText}>
            Below details can be filled with image of the gem or by mannually
          </Text>

          {/* Display selected photos */}
          {form.photos.length > 0 && (
            <View style={styles.photoGrid}>
              {form.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.thumbnail}
                />
              ))}
            </View>
          )}
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
          setValue={(value) => handleInputChange("gemShape", value())}
          setItems={setShapeItems}
          placeholder="Select Gem Shape *"
          style={FormFieldStyles.dropdown}
          dropDownContainerStyle={FormFieldStyles.dropdownContainer}
          listItemContainerStyle={FormFieldStyles.listItemContainer}
          listItemLabelStyle={FormFieldStyles.listItemLabel}
          placeholderStyle={FormFieldStyles.placeholder}
          textStyle={FormFieldStyles.dropdownText}
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
});
