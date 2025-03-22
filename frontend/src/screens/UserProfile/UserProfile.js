//Screen creator: Isum
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Modal as RNModal,
  Linking,
} from "react-native";
import axios from "axios";
import { Ionicons, MaterialIcons,Entypo } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";
import HeaderBar from "../../components/HeaderBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

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
    type: "success",
  });
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const navigation = useNavigation();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_USER_PROFILE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;
      console.log("User Data:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
    setHelpModalVisible(true);
  };

  // Logout handler
  const handleLogout = async () => {
    setMenuVisible(false);

    // Replace the Alert with the custom modal implementation
    setLogoutModalVisible(true);
  };

  // Add a new function for the actual logout process
  const performLogout = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${API_URL}${ENDPOINTS.LOGOUT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear all user data from storage including auto-login info
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("lastLoginTime"); // Clear login timestamp
      await AsyncStorage.removeItem("loginRole"); // Clear role

      // Navigate to welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: "PurposeSelectionPage" }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Use toast notification instead of Alert
      setToast({
        visible: true,
        message: "Logout failed. Please try again.",
        type: "error",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    } finally {
      setLoading(false);
      setLogoutModalVisible(false);
    }
  };

  // Create handlers for opening links
  const openEmail = () => {
    // Use Linking to open email app
    Linking.openURL("mailto:maanikya.app@gmail.com?subject=App%20Feedback");
  };

  const openSocialMedia = (platform) => {
    // Open various social media links
    const links = {
      instagram: "https://www.instagram.com/maanikya_lk/?igsh=NnVvMndqbXV4YW9x#",
      facebook: "https://www.facebook.com/profile.php?id=61569325775449",
      linkedin: "https://www.linkedin.com/company/106414132/admin/dashboard/",
    };

    Linking.openURL(links[platform]);
  };

  // Loading state
  if (loading && !user) {
    return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <HeaderBar title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={baseScreenStyles.colors.primary}
          />
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
    <SafeAreaView style={[baseScreenStylesNew.container, styles.container]}>
      {/* Header with settings menu */}
      <HeaderBar
        title="My Profile"
        rightComponent={
          <Pressable onPress={toggleMenu} style={styles.settingsButton}>
            <MaterialIcons
              name="more-vert"
              size={28}
              color={baseScreenStyles.colors.text.dark}
            />
          </Pressable>
        }
      />

      {/* Settings dropdown menu */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToEditProfile}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={baseScreenStyles.colors.primary}
            />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToHelpCenter}
          >
            <Ionicons
              name="help-circle-outline"
              size={18}
              color={baseScreenStyles.colors.primary}
            />
            <Text style={styles.menuItemText}>Help Center</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
            <Text style={[styles.menuItemText, { color: "#FF6B6B" }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
              <View
                style={[styles.profileImage, styles.profileImagePlaceholder]}
              >
                <Text style={styles.profileImagePlaceholderText}>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>

          <View style={styles.roleContainer}>
            <Ionicons
              name="business"
              size={16}
              color={baseScreenStyles.colors.primary}
            />
            <Text style={styles.profileRole}>{user?.role || "User"}</Text>
          </View>
        </View>

        {/* User information section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {user?.email || "Not provided"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {user?.phone || "Not provided"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="location"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>
                  {user?.address || "Not provided"}
                </Text>
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
                <Ionicons
                  name="person"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>
                  {user?.username || "Not set"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="briefcase"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Account Type</Text>
                <Text style={styles.infoValue}>
                  {user?.accountType?.charAt(0).toUpperCase() +
                    user?.accountType?.slice(1) || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {formatDate(user?.createdAt) || "Unknown"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>My Network</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user?.savedContacts?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Saved Contacts</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user?.favoriteContacts?.length || 0}
              </Text>
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

      {/* Logout Modal */}
      <RNModal
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
      </RNModal>

      {/* Toast Notification */}
      {toast.visible && (
        <View
          style={[
            styles.toastContainer,
            toast.type === "success"
              ? styles.successToast
              : toast.type === "error"
              ? styles.errorToast
              : styles.infoToast,
          ]}
        >
          <MaterialIcons
            name={
              toast.type === "success"
                ? "check-circle"
                : toast.type === "error"
                ? "error"
                : "info"
            }
            size={24}
            color="#fff"
            style={styles.toastIcon}
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
      {/* Help Center Modal */}
      <RNModal
        visible={helpModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.helpModalContent}>
            <View style={styles.helpIconContainer}>
              <MaterialIcons
                name="support-agent"
                size={40}
                color={baseScreenStyles.colors.primary}
              />
            </View>

            <Text style={styles.helpModalTitle}>Contact & Support</Text>
            <Text style={styles.helpModalSubtitle}>
              We're here to help with any questions or feedback
            </Text>

            {/* Email Support */}
            <TouchableOpacity style={styles.supportOption} onPress={openEmail}>
              <View style={styles.supportIconContainer}>
                <MaterialIcons
                  name="email"
                  size={24}
                  color={baseScreenStyles.colors.primary}
                />
              </View>
              <View style={styles.supportTextContainer}>
                <Text style={styles.supportTitle}>Email Support</Text>
                <Text style={styles.supportDescription}>
                  Send us suggestions or report bugs
                </Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#999" />
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            {/* Social Media Section */}
            <Text style={styles.socialMediaTitle}>Follow us for updates</Text>

            <View style={styles.socialMediaContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openSocialMedia("instagram")}
              >
                <Entypo name="instagram-with-circle" size={24} color="#E1306C" />
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openSocialMedia("facebook")}
              >
                <MaterialIcons name="facebook" size={24} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openSocialMedia("linkedin")}
              >
                <Entypo name="linkedin-with-circle" size={24} color="#0077B5" />
                <Text style={styles.socialText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    marginVertical: 12,
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 5,
    shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: baseScreenStyles.colors.text.dark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileImagePlaceholder: {
    backgroundColor: baseScreenStyles.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: baseScreenStyles.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23, 9, 105, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileRole: {
    fontSize: 14,
    color: baseScreenStyles.colors.primary,
    marginLeft: 6,
    fontWeight: "500",
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(23, 9, 105, 0.08)",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#EEEEEE",
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: baseScreenStyles.colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModal: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  logoutIconContainer: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 10,
  },
  logoutMessage: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
    textAlign: "center",
    marginBottom: 20,
  },
  logoutButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  logoutButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.dark,
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  toastContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
  },
  successToast: {
    backgroundColor: "#4CAF50",
  },
  errorToast: {
    backgroundColor: "#F44336",
  },
  infoToast: {
    backgroundColor: "#2196F3",
  },
  toastIcon: {
    marginRight: 10,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  helpModalContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 400,
  },
  helpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(23, 9, 105, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  helpModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 8,
    textAlign: "center",
  },
  helpModalSubtitle: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
    textAlign: "center",
    marginBottom: 24,
  },
  supportOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginVertical: 10,
  },
  supportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(23, 9, 105, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: baseScreenStyles.colors.text.medium,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    width: "100%",
    marginVertical: 16,
  },
  socialMediaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  socialButton: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    flex: 0.3,
  },
  socialText: {
    marginTop: 8,
    fontSize: 12,
    color: baseScreenStyles.colors.text.medium,
  },
  closeModalButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "stretch",
    alignItems: "center",
  },
  closeModalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserProfile;
