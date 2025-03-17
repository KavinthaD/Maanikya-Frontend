//Screen creator: Isum

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // Import QR library
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"; // Import icons
import axios from "axios"; // Import axios
import { API_URL, ENDPOINTS } from "../../config/api"; // Import the API URL and endpoints
import ImageCropPicker from "react-native-image-crop-picker"; // Import ImageCropPicker
import HeaderBar from "../../components/HeaderBar";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";

const MyGems = ({ route, navigation }) => {
  //to conntrol QR popups
  const [popQRCode, setPopQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gemDetails, setGemDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const gemId = route.params?.gemId;
  const qrCodeUrl = route.params?.qrCodeUrl;
  console.log("Received QR URL:", qrCodeUrl);

  useEffect(() => {
    const fetchGemDetails = async () => {
      try {
        let response;
        if (gemId) {
          // Fetch gem details using gemId
          response = await axios.get(
            `${API_URL}${ENDPOINTS.GEMS}/view/id/${gemId}`
          );
        }else if(qrCodeUrl){
          response = await axios.get(
            `${API_URL}${ENDPOINTS.GEMS}/view/${encodeURIComponent(qrCodeUrl)}`
          );
        } 
        setGemDetails(response.data.gem);
      } catch (err) {
        console.error("Error fetching gem details:", err);
        setError(err.response?.data?.message || "Failed to fetch gem details.");
      } finally {
        setLoading(false);
      }
    };

    if (gemId || qrCodeUrl) {
      fetchGemDetails();
    }
  }, [gemId, qrCodeUrl]);

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
        setForm((prev) => ({ ...prev, photos: [result.path] }));
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
        setForm((prev) => ({ ...prev, photos: [result.path] }));
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
    } finally {
      setModalVisible(false);
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // If there's an error, display the error message
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  // If no gem details available
  if (!gemDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No Gem Data Available
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[baseScreenStylesNew.backgroundColor,baseScreenStylesNew.container]} 
      edges={['bottom', 'left', 'right']} // Don't include 'top' here
    >
      <HeaderBar 
        title="Gem Profile" 
        navigation={navigation} 
        showBack={true} 
        style={styles.header}
      />

      <ScrollView 
        style={[styles.scrollView, baseScreenStylesNew.backgroundColor]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: gemDetails?.photo ||
                "https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg",
            }}
            style={styles.gemImage}
            resizeMode="contain"
          />
          <View style={styles.badgeContainer}>
            <TouchableOpacity
              style={styles.qrBadge}
              onPress={() => setPopQRCode(true)}
            >
              {qrCodeUrl ? (
                <QRCode value={qrCodeUrl} size={50} quietZone={5} />
              ) : (
                <Text>No QR</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.infoCard}>
            <View style={styles.gemHeader}>
              <View>
                <Text style={styles.gemId}>Gem ID - {gemDetails?.gemId || "N/A"}</Text>
                <Text style={styles.gemType}>
                  {gemDetails?.details?.weight} ct {gemDetails?.details?.gemType}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color="#555" />
                <Text style={styles.infoLabel}>Added on:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.createdAt
                    ? new Date(gemDetails.createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="diamond" size={20} color="#555" />
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.details?.gemType || "N/A"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="weight" size={20} color="#555" />
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.details?.weight?.toString() || "N/A"} ct
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="ruler" size={20} color="#555" />
                <Text style={styles.infoLabel}>Size:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.details?.dimensions || "N/A"} mm
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="shapes" size={20} color="#555" />
                <Text style={styles.infoLabel}>Shape:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.details?.gemShape || "N/A"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="color-palette" size={20} color="#555" />
                <Text style={styles.infoLabel}>Color:</Text>
                <Text style={styles.infoValue}>
                  {gemDetails?.details?.color || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.financialSection}>
              <Text style={styles.sectionTitle}>Financial Details</Text>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#555" />
                <Text style={styles.infoLabel}>Purchase:</Text>
                <Text style={styles.infoValue}>
                  LKR {gemDetails?.details?.purchasePrice?.toString() || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#555" />
                <Text style={styles.infoLabel}>Cost:</Text>
                <Text style={styles.infoValue}>
                  LKR {gemDetails?.details?.cost?.toString() || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#555" />
                <Text style={styles.infoLabel}>Sold:</Text>
                <Text style={styles.infoValue}>
                  LKR {gemDetails?.details?.soldPrice?.toString() || "N/A"}
                </Text>
              </View>
            </View>

            {/* Certificate Image Section */}
            <View style={styles.certificateSection}>
              <Text style={styles.sectionTitle}>Certificate</Text>
              <Image
                source={{
                  uri: gemDetails?.certificateUrl ||
                    gemDetails?.certificate ||
                    "https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg",
                }}
                style={styles.certificateImage}
                resizeMode="contain"
              />
              {/* Add Certificate Button */}
              <TouchableOpacity onPress={handleCameraPress} style={[baseScreenStylesNew.Button1,styles.addCertificateButton]}>
                <FontAwesome5 name="plus" size={16} color="white" />
                <Text style={styles.addButtonText}>Add Gem Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* QR Code Popup modal */}
      <Modal transparent visible={popQRCode} animationType="fade">
        <View style={styles.popUpContainer}>
          <View style={styles.popUpContent}>
            <Text style={styles.modalTopic}>QR Code</Text>
            <View tyle={styles.qrCodeWrapper}>
              {qrCodeUrl ? (
                <QRCode value={qrCodeUrl} size={200} quietZone={10} />
              ) : (
                <Text>No QR Code available</Text>
              )}
            </View>
            <Button title="Close" onPress={() => setPopQRCode(false)} />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.popUpContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color="#170969" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChooseFromGallery}
            >
              <Ionicons name="images" size={24} color="#170969" />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Updated styles
const styles = StyleSheet.create({

  scrollView: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
    marginBottom: 20,
  },
  gemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  badgeContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  qrBadge: {
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  gemHeader: {
    marginBottom: 15,
  },
  gemId: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  gemType: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginLeft: 5,
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  financialSection: {
    marginBottom: 15,
  },
  certificateSection: {
    alignItems: "center",
  },
  certificateImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  addCertificateButton: {
    marginTop: 20,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    textAlign: "center",
  },
  // Keep existing modal styles
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popUpContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTopic: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#170969",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#ff0000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // No top padding or margin here
  },
  header: {
    // Add elevation to make header appear above content
    zIndex: 10,
    // Remove any extra padding that might push it down
    paddingTop: 0,
    marginTop: 0,
  },
});

export default MyGems;
