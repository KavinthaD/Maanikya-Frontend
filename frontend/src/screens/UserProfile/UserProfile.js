//Screen creator: Isum
import React, { useState, useEffect } from "react";
import { 
  Alert, SafeAreaView, View, Text, Image, TouchableOpacity, 
  StyleSheet, Pressable, ActivityIndicator, ScrollView, Modal 
} from "react-native";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from '../../config/api'; 
import HeaderBar from "../../components/HeaderBar";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'expo-linear-gradient';

const UserProfile = ({ route }) => {
  // State variables
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success"
  });
  
  const navigation = useNavigation();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch user data whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Get user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the token from storage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_USER_PROFILE}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data;
      console.log('User Data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Menu visibility toggle
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Navigation handlers
  const navigateToEditProfile = () => {
    setMenuVisible(false);
    navigation.navigate("BusinessOwnerEditProfile", { user });
  };
  
  const navigateToHelpCenter = () => {
    setMenuVisible(false);
    navigation.navigate("HelpCenter");
  };

  // Logout handler
  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutModalVisible(true);
  };

  // Perform logout
  const performLogout = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(`${API_URL}${ENDPOINTS.LOGOUT}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Clear all user data from storage
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      
      // Navigate to welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'PurposeSelectionPage' }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Show error toast instead of Alert
      setToast({
        visible: true,
        message: "Logout failed. Please try again.",
        type: "error"
      });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    } finally {
      setLoading(false);
      setLogoutModalVisible(false);
    }
  };

  // Loading state
  if (loading && !user) {
    return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <HeaderBar title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={baseScreenStyles.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <HeaderBar title="Profile" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[baseScreenStylesNew.container,styles.container]}>
      {/* Header with settings menu */}
      <HeaderBar 
        title="My Profile" 
        rightComponent={
          <Pressable onPress={toggleMenu} style={styles.settingsButton}>
            <MaterialIcons name="more-vert" size={28} color={baseScreenStyles.colors.text.dark} />
          </Pressable>
        }
      />

      {/* Settings dropdown menu */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToEditProfile}>
            <Ionicons name="create-outline" size={18} color={baseScreenStyles.colors.primary} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToHelpCenter}>
            <Ionicons name="help-circle-outline" size={18} color={baseScreenStyles.colors.primary} />
            <Text style={styles.menuItemText}>Help Center</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
            <Text style={[styles.menuItemText, { color: "#FF6B6B" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero section with profile image and name */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {user?.image ? (
              <Image 
                source={{ uri: user.image }} 
                style={styles.profileImage}
                defaultSource={require("../../assets/default-images/avatar.png")}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                <Text style={styles.profileImagePlaceholderText}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
            
          </View>
          
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>
          
          <View style={styles.roleContainer}>
            <Ionicons name="business" size={16} color={baseScreenStyles.colors.primary} />
            <Text style={styles.profileRole}>{user?.role || "User"}</Text>
          </View>
          </View>

        {/* User information section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "Not provided"}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || "Not provided"}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user?.address || "Not provided"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account information section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user?.username || "Not set"}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="briefcase" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Account Type</Text>
                <Text style={styles.infoValue}>
                  {user?.accountType?.charAt(0).toUpperCase() + user?.accountType?.slice(1) || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color={baseScreenStyles.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{formatDate(user?.createdAt) || "Unknown"}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Statistics section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>My Network</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.savedContacts?.length || 0}</Text>
              <Text style={styles.statLabel}>Saved Contacts</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.favoriteContacts?.length || 0}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={navigateToEditProfile}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.logoutIconContainer}>
              <MaterialIcons name="logout" size={40} color="#FF6B6B" />
            </View>
            
            <Text style={styles.logoutTitle}>Sign Out</Text>
            <Text style={styles.logoutMessage}>
              Are you sure you want to sign out of your account?
            </Text>
            
            <View style={styles.logoutButtonsContainer}>
              <TouchableOpacity
                style={[styles.logoutButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.logoutButton, styles.confirmButton]}
                onPress={performLogout}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Sign Out</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast Notification */}
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
    paddingBottom : 40,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginVertical: 12,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 7,
    zIndex: 2,
    width: 180,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: baseScreenStyles.colors.text.dark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImagePlaceholder: {
    backgroundColor: baseScreenStyles.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: baseScreenStyles.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 9, 105, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileRole: {
    fontSize: 14,
    color: baseScreenStyles.colors.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(23, 9, 105, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: baseScreenStyles.colors.text.medium,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: baseScreenStyles.colors.text.medium,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: baseScreenStyles.colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoutButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: baseScreenStyles.colors.text.medium,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 9999,
  },
  successToast: {
    backgroundColor: baseScreenStyles.colors.success,
  },
  errorToast: {
    backgroundColor: baseScreenStyles.colors.error,
  },
  infoToast: {
    backgroundColor: baseScreenStyles.colors.primary,
  },
  toastText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  toastIcon: {
    marginRight: 10,
  },
});

export default UserProfile;