//Screen creator: Kavintha

import React, { useState } from "react"; // **Import useState**
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { baseScreenStyles } from "../styles/baseStyles";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header_1 from "../components/Header_1";
import Header_2 from "../components/Header_2";
import Gem_register_2 from "./GemRegister2"; // Import GemRegister2

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
  const [form, setForm] = useState({
    color: "",
    description: "",
    photos: [],
  });
  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const handleContinue = () => {
    console.log("Form Submitted:", form);
    navigation.navigate("GemRegister2", { formData: form }); // Navigate to GemRegister2
  };

  const handleCameraPress = () => {
    Alert.alert("Add Photo", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await launchCamera({
            mediaType: "photo",
            cameraType: "back",
            quality: 1,
          });
          if (result.assets) {
            setForm((prev) => ({
              ...prev,
              photos: [...prev.photos, result.assets[0].uri],
            }));
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 1,
            selectionLimit: 0,
          });
          if (result.assets) {
            setForm((prev) => ({
              ...prev,
              photos: [
                ...prev.photos,
                ...result.assets.map((asset) => asset.uri),
              ],
            }));
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={baseScreenStyles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContent}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleCameraPress}
          >
            <Image
              source={require("../assets/camera.png")}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.addPhotoButtonText}>Add photos</Text>

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
          style={styles.input}
          placeholder="Gem lot name (optional)"
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Color"
          value={form.contactNumber}
          onChangeText={(value) => handleInputChange("contactNumber", value)}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={baseScreenStyles.blueButton}
          onPress={handleContinue} // Navigate on button press
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  finalizeButton: {
    backgroundColor: "#170969",
    padding: 10,
    borderRadius: 5,
  },
  innerContainer: {
    padding: 20,
    paddingVertical: 60,
  },
  input: {
    backgroundColor: "#E8F0FE",
    color: "black",
    padding: 13,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
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
});
