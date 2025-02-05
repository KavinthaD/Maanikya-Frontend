import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

const BusinessOwnerProfilePhoto = () => {
  const [photo, setPhoto] = useState(null);

  // Function to open gallery
  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  // Function to open camera
  const openCamera = () => {
    launchCamera({ mediaType: "photo", quality: 1, saveToPhotos: true }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topic}>
        <Text style={styles.topicName}>Scan</Text>
      </View>

      
      <View style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.profilePic} />
        ) : (
          <Image
            source={require("../assets/camera.png")}
            style={styles.cameraIcon}
          />
        )}
      </View>

   
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
    flex: 1,
    backgroundColor: "#a9c9d3",
    alignItems: "center",
    justifyContent: "center",
  },
  topic: {
    width: "100%",
    backgroundColor: "#082f4f",
    padding: 15,
    position: "absolute",
    top: 0,
    alignItems: "center",
    marginTop: 50
  },
  topicName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    backgroundColor: "#e3f1fc",
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 20,
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
});

export default BusinessOwnerProfilePhoto;
