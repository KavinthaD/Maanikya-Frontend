//Screen creator: Isum

import React, { useState, useEffect } from "react";
import {View, Text, TextInput,Image,TouchableOpacity,StyleSheet, Modal, KeyboardAvoidingView, Platform, Alert,ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons} from "@expo/vector-icons";
import ImageCropPicker from "react-native-image-crop-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '../../config/api'; 
import HeaderBar from "../../components/HeaderBar";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";

const BusinessOwnerEditProfile = ({ navigation, route }) => {
  //Destructuring the user data if available, other wise display null
  const { user } = route.params || {};

  // Profile state
  const [profilePhoto, setProfilePhoto] = useState(user?.image || null); 
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contact, setContact] = useState(user?.phone || "");
  const [title, setTitle] = useState(user?.role || ""); // Use user.role
  const [address, setAddress] = useState(user?.address || "");
  const [isModalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    // Optionally update state if user prop changes
    if (route.params?.user) {
        const { user } = route.params;
        setProfilePhoto(user.image || null);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setContact(user.phone || "");
        setTitle(user.role || "");
        setAddress(user.address || "");
    }
}, [route.params?.user]);

  const handleCameraPress = () => {
    setModalVisible(true); //sets modal visibility
  };
//handle taking photo using camera
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
        setProfilePhoto(result.path);  //setting profile state with the path
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setModalVisible(false);
    }
  };
  //handle choosing images from the gallery
  const handleChooseFromGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: IMAGE_CONSTRAINTS.maxWidth,
        height: IMAGE_CONSTRAINTS.maxHeight,
        mediaType: "photo",
        includeBase64: true,
        cropping: true,
        cropperCircleOverlay: false,
        cropperStatusBarColor: "#9CCDDB",
        cropperToolbarColor: "#9CCDDB",
      });

      if (result && result.path) {
        setProfilePhoto(result.path);         //setting profile state with the path
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
    } finally {
      setModalVisible(false);
    }
  };
  //handle saving profile data
  const handleSave = async () => {
    try {
      // Get the token from storage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      
      const formData = new FormData();

      // append the fields to the FormData object
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", contact);
      formData.append("role", title);
      formData.append("address", address);
      
      if (profilePhoto) {
        formData.append("image", {
          uri: profilePhoto,
          type: "image/jpeg", // Adjust the type based on your image format
          name: "profile.jpg", 
        });
      }


      const response = await fetch(`${API_URL}${ENDPOINTS.UPDATE_PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include the token
        },
        body: formData,  
      });
      console.log("GUser profile updated successfully:", response.data);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        Alert.alert('Update Failed', errorData.message || 'Something went wrong.'); // Show user-friendly error
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('Profile updated:', data);
        Alert.alert('Success', 'Profile updated successfully!');

        // Navigate back and pass 
        navigation.navigate("BS_NavBar", { screen: "Profiles" });
      } else {
        console.error('Unexpected content type:', contentType);
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.  Check your network connection.');
    }
  };

  return (
    <View style={baseScreenStylesNew.container}>
      <HeaderBar 
        title="Edit Profile" 
        navigation={navigation} 
        showBack={true} 
      />

      
      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ 
            flex: 1, 
            margin: 0, // Adjust the margin as needed
            padding: 0 // Adjust the padding as needed
        }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Profile photo */}
        <View style={styles.profileContainer}>
          <Image
             source={{ uri: profilePhoto }}
            style={styles.profilePhoto}
          />
          {/*edit photo button*/}
          <TouchableOpacity style={styles.editPhotoBtn} onPress={handleCameraPress}>
            <Ionicons name="camera" size={22} color ="#0a3a5d" />
          </TouchableOpacity>
        </View>
        {/*edit fields*/}    
        <View style={styles.inputContainer}>
          <Text style={[styles.label, baseScreenStylesNew.blackText]}>First name</Text>
          <TextInput
            style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
            value={firstName} 
            onChangeText={setFirstName}
            placeholderTextColor="#777"
          />

          <Text style={[styles.label, baseScreenStylesNew.blackText]}>Last name</Text>
          <TextInput
            style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#777"
          />

          <Text style={[styles.label, baseScreenStylesNew.blackText]}>Email</Text>
          <TextInput
            style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#777"
          />

          <Text style={[styles.label, baseScreenStylesNew.blackText]}>Contact no</Text>
          <TextInput
            style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
            placeholderTextColor="#777"
          />

          <Text style={[styles.label, baseScreenStylesNew.blackText]}>Title</Text>
          <TextInput style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
           value={title} onChangeText={setTitle} />

          <Text style={[styles.label, baseScreenStylesNew.blackText]}>Address</Text>
          <TextInput
            style={[baseScreenStylesNew.themeText, baseScreenStylesNew.Button6, styles.input]}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholderTextColor="#777"
          />
        </View>
        {/*save button*/}    
        <TouchableOpacity style={[baseScreenStylesNew.Button1,styles.saveBtn]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        </ScrollView>
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color="#170969" />
                <Text style={styles.modalButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleChooseFromGallery}>
                <Ionicons name="image" size={24} color="#170969" />
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
      </KeyboardAvoidingView>  
    </View>
  );
};

const styles = StyleSheet.create({

  profileContainer: {
    alignItems: "center",
    padding:"0",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 0,
    right: 150,
    backgroundColor: "#dbe9fa",
    borderRadius: 15,
    padding: 5,
  },
  icon: {
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 3,
  },
  input: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    borderRadius: 8,
    marginHorizontal: 40,
    width: "80%",
    marginTop: 85,
    marginBottom:20
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
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

export default BusinessOwnerEditProfile;
