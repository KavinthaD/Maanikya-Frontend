//Screen creator: Isum

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";  
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

const BusinessOwnerProfilePhoto = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [libraryPermission, setLibraryPermission] = useState(null);
  const email = "rathnasiri.n@hotmail.com";

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
      setPhoto(result.assets[0].uri);  
    }
  };
  const uploadPhoto = async () => {
    if (!photo) {
      Alert.alert("No photo selected", "Please select or take a photo first.");
      return;
    }

    let formData = new FormData();
    const filename = photo.split('/').pop();  // Extract filename from URI
    const match = /\.(.+)$/.exec(filename);   // Extract file extension
    const type = match ? `image/${match[1]}` : `image`;  // Set correct MIME type

    formData.append("image", {
      uri: Platform.OS === "android" ? photo : photo.replace("file://", ""),
      type: type,  // Use the dynamically determined MIME type
      name: filename,
    });

    try {
      const response = await fetch(`http://localhost:5000/display/upload/${email}`, {
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.ok) {
        Alert.alert("Photo uploaded", "Your profile photo has been updated.");
        navigation.goBack();  
        const errorText = await response.text();  
        Alert.alert("Upload failed", `Server responded with: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", error.message);  
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Profile Picture Section */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={openCamera} style={styles.cameraButton} >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.profilePic} />
          ) : (
            <Ionicons name="camera" size={80} color="#888" />
          )}
        </TouchableOpacity>
        
      </View>

      {/* Buttons to open Gallery or Camera */}
      <TouchableOpacity style={styles.photoBtn} onPress={openGallery}>
        <Text style={styles.photoBtnText}>Gallery</Text>
      </TouchableOpacity>


      {photo && (
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadPhoto}>
          <Text style={styles.uploadBtnText}>Upload Photo</Text>
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a9c9d3",
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
    paddingHorizontal: 3,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  photoBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  backBtn: {
    marginLeft: 15,
  },
  uploadBtn: {
    backgroundColor: "#0c3c60",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  uploadBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  backBtn:{
      marginLeft: 15,
  },

});

export default BusinessOwnerProfilePhoto;
