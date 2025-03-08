//Screen creator: Isum

import React, { useState, useEffect } from "react";
import {View, Text, TextInput,Image,TouchableOpacity,StyleSheet, Modal, KeyboardAvoidingView, Platform, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons} from "@expo/vector-icons";
import ImageCropPicker from "react-native-image-crop-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusinessOwnerEditProfile = ({ navigation, route }) => {
 
  const { user } = route.params || {};

  // Profile state
  
  const [profilePhoto, setProfilePhoto] = useState(user?.image || null); // Use optional chaining and fallback
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contact, setContact] = useState(user?.phone || "");
  const [title, setTitle] = useState(user?.role || ""); // Use user.role
  const [address, setAddress] = useState(user?.address || "");
  const [isModalVisible, setModalVisible] = useState(false);

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
        setProfilePhoto(result.path);
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
        setProfilePhoto(result.path);
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
    } finally {
      setModalVisible(false);
    }
  };

  

  const handleSave = async () => {
    try {
      //const token = await AsyncStorage.getItem('authToken'); // Get the auth token
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M0NWRmMWZlYWFhMzc5YmQzYTMxOGQiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJsb2dpblJvbGUiOiJHZW0gYnVzaW5lc3Mgb3duZXIiLCJ0eXBlIjoiYnVzaW5lc3MiLCJpYXQiOjE3NDE0NDA0MDMsImV4cCI6MTc0MTUyNjgwM30.R__Woqu8KAMQHP8PHgroFfWCcMvw17ahlq-90BPkG1g";
      const response = await fetch('http://10.0.2.2:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: contact,
          role: title, // Use the title state
          address: address,
          image: profilePhoto, // Send image URL if changed
        }),
      });

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

        // Navigate back and pass updated data (using navigation.navigate instead of goBack)
        navigation.navigate('BusinessOwnerProfile', { updatedUser: data.user }); // Pass the updated user data
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
      {/* Profile photo */}
        <View style={styles.profileContainer}>
          <Image
             source={{ uri: profilePhoto }}
            style={styles.profilePhoto}
          />
          {/*edit photo button*/}
          <TouchableOpacity style={styles.editPhotoBtn} onPress={handleCameraPress}>
            <Ionicons name="pencil" size={20} color ="#0a3a5d" />
          </TouchableOpacity>
        </View>
        {/*edit fields*/}    
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First NAME</Text>
          <TextInput
            style={styles.input}
            value={firstName} 
            onChangeText={setFirstName}
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Last NAME</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Contact No</Text>
          <TextInput
            style={styles.input}
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>TITLE</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholderTextColor="#777"
          />
        </View>
        {/*save button*/}    
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },

  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 10,
    right: 120,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 3,
  },
  input: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
    color: "#333", 
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#29abe2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 25,
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
