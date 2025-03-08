//Screen creator: Isum

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QR library
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import icons
import axios from "axios"; // Import axios
import { API_URL, ENDPOINTS } from "../../config/api"; // Import the API URL and endpoints
import ImageCropPicker from 'react-native-image-crop-picker'; // Import ImageCropPicker

const MyGems = ({ route, navigation }) => {
  //to conntrol QR popups
  const [popQRCode, setPopQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gemDetails, setGemDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


  const qrCodeUrl = route.params?.qrCodeUrl;
  console.log("Received QR URL:", qrCodeUrl);

  useEffect(() => {
    const fetchGemDetails = async () => {
      try {
        console.log("Fetching with URL:", qrCodeUrl);
        
        // Pass the qrCodeUrl as a route parameter instead of query parameter
        const response = await axios.get(
          `${API_URL}${ENDPOINTS.GEMS}/view/${encodeURIComponent(qrCodeUrl)}`
        );

        console.log("API Response:", response.data);
        setGemDetails(response.data.gem);
      } catch (err) {
        console.error("Error fetching gem details:", err);
        setError(err.response?.data?.message || "Failed to fetch gem details.");
      } finally {
        setLoading(false);
      }
    };

    if (qrCodeUrl) {
      fetchGemDetails();
    }
  }, [qrCodeUrl]);

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
    <SafeAreaView style={styles.container}>
     
      <View style={styles.imageContainer}>
        {/* Gem Image */}
        <Image
          source={{
            uri: gemDetails?.photo || "https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg"
          }}
          style={styles.gemPhoto}
          onError={(error) => {
            console.error("Image loading error:", error);
            // You might want to set a fallback image here
          }}
        />
        {/*Popup QR code*/}
        <TouchableOpacity
        style={styles.qrContainer}
          onPress={() => setPopQRCode(true)}
        >
          <View>
            {qrCodeUrl ? (
              <QRCode 
                value={qrCodeUrl} 
                size={50}
                quietZone={5}
              />
            ) : (
              <Text>No QR Code</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Gem ID */}
      <Text style={styles.gemId}>Gem ID - {gemDetails?.gemId || "N/A"}</Text>
      {/* Gem Details */}
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}> Date added to system - {
    gemDetails?.createdAt 
      ? new Date(gemDetails.createdAt).toISOString().split('T')[0]
      : "N/A"}</Text>
        <Text style={styles.detailText}>Identification - {gemDetails?.details?.gemType || "N/A"}</Text>
        <Text style={styles.detailText}>Weight - {gemDetails?.details?.weight?.toString() || "N/A"}</Text>
        <Text style={styles.detailText}>Measurements - {gemDetails?.details?.dimensions || "N/A"}</Text>
        <Text style={styles.detailText}>Shape - {gemDetails?.details?.gemShape || "N/A"}</Text>
        <Text style={styles.detailText}>Color - {gemDetails?.details?.color || "N/A"}</Text>
        <Text style={styles.detailText}>Additional Information -  {gemDetails?.details?.extraInfo || "N/A"}</Text>
      </View>
      {/*Financial Details */}
      <View style={styles.detailCard}>
        <Text style={styles.detailText}>Purchase Price - {gemDetails?.details?.purchasePrice?.toString() || "N/A"}</Text>
        <Text style={styles.detailText}>Cost - {gemDetails?.details?.cost?.toString() || "N/A"}</Text>
        <Text style={styles.detailText}>Sold Price - {gemDetails?.details?.soldPrice?.toString() || "N/A"}</Text>
      </View>

      {/* Certificate Image */}
      <Image
        source={{
          uri: gemDetails?.certificateUrl || gemDetails?.certificate || "https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg"
        }}
        style={styles.gemCert}
        onError={(error) => console.error("Certificate image loading error:", error)}
      />
      {/*edit button for editing the profile*/}
      <TouchableOpacity onPress={handleCameraPress} style={styles.editBtn}>
        <FontAwesome5 name="pen" size={16} color="white" />
      </TouchableOpacity>

      {/* QR Code Popup modal */}
      <Modal transparent visible={popQRCode} animationType="fade">
        <View style={styles.popUpContainer}>
          <View style={styles.popUpContent}>
            <Text style={styles.modalTopic}>QR Code</Text>
            <View tyle={styles.qrCodeWrapper}>
              {qrCodeUrl ? (
                <QRCode 
                 value={qrCodeUrl} 
                 size={200}
                 quietZone={10}
               />
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CCDDB',
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#082f4f',
    padding: 15,
  },
  topicName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
  },
  gemPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editBtn: {
    position: 'absolute',
    top: 620,
    left: 150,
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  qrContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  gemId: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: '#0B3D4B',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 3,
  },
  gemCert: {
    width: 120,
    height: 80,
    marginLeft: 20,
    borderRadius: 5,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUpContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTopic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#170969',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#ff0000',
  },

});

export default MyGems;
