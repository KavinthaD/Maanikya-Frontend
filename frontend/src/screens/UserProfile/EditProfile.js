//Screen creator: Isum

import React, { useState, useEffect } from "react";
import {
  View, 
  Text, 
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet, 
  Modal, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  ScrollView,
  ActivityIndicator,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ImageCropPicker from "react-native-image-crop-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '../../config/api'; 
import HeaderBar from "../../components/HeaderBar";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import { Camera } from "expo-camera";

const EditProfile = ({ navigation, route }) => {
  // Destructuring the user data if available
  const { user } = route.params || {};

  // Profile state
  const [profilePhoto, setProfilePhoto] = useState(user?.image || null); 
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contact, setContact] = useState(user?.phone || "");
  const [title, setTitle] = useState(user?.role || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // success, error, info
  });

  // Update IMAGE_CONSTRAINTS
  const IMAGE_CONSTRAINTS = {
    maxWidth: 2048,
    maxHeight: 2048,
    minWidth: 300,
    minHeight: 300,
    maxSizeMB: 15,
    quality: 0.9,
    allowedFormats: ["jpeg", "jpg", "png"],
    aspectRatio: [1, 1],
  };

  useEffect(() => {
    if (route.params?.user) {
      const { user } = route.params;
      setProfilePhoto(user.image || null);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setContact(user.phone || "");
      setTitle(user.role || "");
      setAddress(user.address || "");
    }
  }, [route.params?.user]);

  const handleCameraPress = async () => {
    try {
              const { status } = await Camera.requestCameraPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Permission Required",
                  "This app needs camera and gallery access to get user photo. Pleasse go to settings and enable permissions for camera",
                  [
                    {
                      text: "Open Settings",
                      onPress: () => Linking.openSettings(),
                    },
                    { text: "Cancel", style: "cancel" },
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
        cropperCircleOverlay: true,
        cropperStatusBarColor: baseScreenStyles.colors.primary || "#170969",
        cropperToolbarColor: baseScreenStyles.colors.primary || "#170969",
        cropperToolbarWidgetColor: "#FFFFFF", 
      });

      if (result && result.path) {
        setProfilePhoto(result.path);
        setPhotoChanged(true);
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
        width: IMAGE_CONSTRAINTS.maxWidth,
        height: IMAGE_CONSTRAINTS.maxHeight,
        mediaType: "photo",
        includeBase64: false,
        cropping: true,
        cropperCircleOverlay: true,
        cropperStatusBarColor: baseScreenStyles.colors.primary || "#170969",
        cropperToolbarColor: baseScreenStyles.colors.primary || "#170969",
        cropperToolbarWidgetColor: "#FFFFFF", 
      });

      if (result && result.path) {
        setProfilePhoto(result.path);
        setPhotoChanged(true);
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      message,
      type,
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Get the token from storage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create form data object
      const formData = new FormData();
      
      // Add profile data
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", contact);
      formData.append("role", title);
      formData.append("address", address);
      
      // Add profile photo if changed
      if (photoChanged && profilePhoto) {
        const filename = profilePhoto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append("image", {
          uri: profilePhoto,
          name: filename,
          type
        });
      }

      // Send multipart form data
      const response = await fetch(`${API_URL}${ENDPOINTS.UPDATE_PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        showToast(errorData.message || 'Update failed. Please try again.', "error");
        return;
      }

      const data = await response.json();
      console.log('Profile updated:', data);
      
      // Show success message
      showToast("Profile updated successfully!");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[baseScreenStylesNew.container,styles.container]}>
      <HeaderBar 
        title="Edit Profile" 
        navigation={navigation} 
        showBack={true} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile header with photo */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profilePhoto}
                />
              ) : (
                <View style={[styles.profilePhoto, styles.profileImagePlaceholder]}>
                  <Text style={styles.profileImagePlaceholderText}>
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.editPhotoBtn} onPress={handleCameraPress}>
                <Ionicons name="camera" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form fields in cards */}
          <View style={styles.formContainer}>
            {/* Personal Information Card */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={firstName} 
                    onChangeText={setFirstName}
                    placeholder="Enter your first name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter your last name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="at" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Professional Title</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="work-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    value={title} 
                    onChangeText={setTitle}
                    placeholder="Enter your professional title" 
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>

            {/* Contact Information Card */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Address</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={3}
                    placeholder="Enter your address"
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveBtn, loading && styles.disabledBtn]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Photo Selection Modal */}
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Profile Photo</Text>
                <TouchableOpacity 
                  style={styles.modalCloseBtn} 
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color={baseScreenStyles.colors.primary || "#170969"} />
                <Text style={styles.modalButtonText}>Take New Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleChooseFromGallery}>
                <Ionicons name="images" size={24} color={baseScreenStyles.colors.primary || "#170969"} />
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              {profilePhoto && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.removeButton]} 
                  onPress={() => {
                    setProfilePhoto(null);
                    setPhotoChanged(true);
                    setModalVisible(false);
                  }}
                >
                  <Ionicons name="trash" size={24} color="#FF6B6B" />
                  <Text style={[styles.modalButtonText, {color: '#FF6B6B'}]}>Remove Photo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.cancelModalBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      {toast.visible && (
        <View style={[
          styles.toastContainer, 
          toast.type === "success" ? styles.successToast : 
          toast.type === "error" ? styles.errorToast : styles.infoToast
        ]}>
          <MaterialIcons 
  name={toast.type === "success" ? "check-circle" : 
        toast.type === "error" ? "error" : "info"} 
  size={24} 
  color="#fff" 
  style={styles.toastIcon}
/>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: -60,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: 'rgba(23, 9, 105, 0.05)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  profileImageContainer: {
    position: "relative",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImagePlaceholder: {
    backgroundColor: baseScreenStyles.colors.primary || "#170969",
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: baseScreenStyles.colors.primary || "#170969",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text?.dark || "#212121",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: baseScreenStyles.colors.text?.medium || "#757575",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: baseScreenStyles.colors.primary || "#170969",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelBtnText: {
    color: baseScreenStyles.colors.text?.medium || "#757575",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text?.dark || "#212121",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text?.dark || "#212121",
    marginLeft: 12,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#FFF3F3',
  },
  cancelModalBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelModalText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text?.medium || "#757575",
    fontWeight: '500',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  successToast: {
    backgroundColor: '#4CAF50',
  },
  errorToast: {
    backgroundColor: '#F44336',
  },
  infoToast: {
    backgroundColor: '#2196F3',
  },
  toastIcon: {
    marginRight: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EditProfile;