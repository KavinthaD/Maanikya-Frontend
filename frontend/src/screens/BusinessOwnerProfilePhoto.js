//Screen creator: Isum

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";  
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { baseScreenStyles } from "../styles/baseStyles";

const BusinessOwnerProfilePhoto = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [libraryPermission, setLibraryPermission] = useState(null);

  // Request camera and media library permissions
  const requestPermissions = async () => {
    // Request camera permission
    const cameraPermissionResult = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermissionResult.status);

    // Request media library permission
    const libraryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setLibraryPermission(libraryPermissionResult.status);

    if (cameraPermissionResult.status !== "granted" || libraryPermissionResult.status !== "granted") {
      Alert.alert("Permission denied", "Camera and Photo Library permissions are required.");
    }
  };

  // Function to open gallery
  const openGallery = async () => {
    if (libraryPermission !== "granted") {
      Alert.alert("Permission Denied", "You need to grant photo library permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Photo,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  // Function to open camera
  const openCamera = async () => {
    if (cameraPermission !== "granted") {
      Alert.alert("Permission Denied", "You need to grant camera permissions.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaType: ImagePicker.MediaTypeOptions.Photo,
      quality: 1,
      allowsEditing: true,
      saveToPhotos: true,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={[baseScreenStyles.container,styles.container]}>
      {/* Header */}
      <View style={styles.topic}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topicName}>Scan</Text>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.profilePic} />
        ) : (
          <Image source={require("../assets/camera.png")} style={styles.cameraIcon} />
        )}
      </View>

      {/* Buttons to open Gallery or Camera */}
      <TouchableOpacity style={styles.photoBtn} onPress={openGallery}>
        <Text style={styles.photoBtnText}>Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.photoBtn, { marginTop: 10 }]} onPress={openCamera}>
        <Text style={styles.photoBtnText}>Take a Photo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    
    alignItems: "center",
  },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0a3a5d",
    width: "100%",
  },
  topicName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: "#e3f1fc",
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 100,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    tintColor: "black",
  },
  profilePic: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  photoBtn: {
    backgroundColor: "#0c3c60",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  photoBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  backBtn: {
    marginLeft: 15,
  },
});

export default BusinessOwnerProfilePhoto;
