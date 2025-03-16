//Screen Creator Tilmi

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';



const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7} // Added feedback when pressed
  >
    <View style={styles.iconContainer}>
      <Image 
        source={image} 
        style={styles.imageStyle} 
        resizeMode="contain"
      />
      <Text style={styles.menuText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQrScan = () => {
    setModalVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setModalVisible(false);
    // Handle scanned QR code data
    navigation.navigate("Orders", { qrCodeData: data });
  };

  const handleScanFromCamera = () => {
    setModalVisible(false);
    setScanning(true);
  };

  const handleScanFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          const scannedBarcodes = await BarCodeScanner.scanFromURLAsync(
            result.assets[0].uri
          );
          
          if (scannedBarcodes.length > 0) {
            setModalVisible(false);
            navigation.navigate("Orders", { 
              qrCodeData: scannedBarcodes[0].data 
            });
          } else {
            Alert.alert('Error', 'No valid QR code found in the image');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to scan QR code');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    }
  };

  const menuItems = [
    {
      image: require("../../assets/menu-icons/9.png"),
      screen: "Orders",
    },
    {
      image: require("../../assets/menu-icons/10.png"),
      screen: "WorkerFinancialRecords", 
    },
    {
      image: require("../../assets/menu-icons/2.png"),
      onPress: handleQrScan,
    },
    {
      image: require("../../assets/menu-icons/chat.jpeg"),
      screen: "MessageInbox",
    },
  ];

  // Update the handleMenuItemPress function to handle both screen navigation and custom actions
  const handleMenuItemPress = (screenName, customOnPress) => {
    if (customOnPress) {
      customOnPress();
    } else if (screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={baseScreenStylesNew.container}>
      {scanning ? (
        <Camera
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        >
          <View style={styles.scannerOverlay}>
            <Text style={styles.scannerText}>Align QR code within frame</Text>
            <TouchableOpacity 
              style={styles.cancelScanButton}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.cancelScanButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <View style={styles.content}>
            <Image source={require("../../assets/logo-letter.png")} style={styles.logo}/>
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  image={item.image}
                  title={item.title}
                  onPress={() => 
                    handleMenuItemPress(item.screen, item.onPress)
                  }
                />
              ))}
            </View>
          </View>
        </>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIndicator} />
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleScanFromCamera}
          >
            <Icon name="camera-alt" size={24} color="#170969" />
            <Text style={styles.modalButtonText}>Scan with Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleScanFromGallery}
          >
            <Icon name="photo-library" size={24} color="#170969" />
            <Text style={styles.modalButtonText}>Choose QR from Gallery</Text>
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
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  logo: {
    width: 130,  
    height: 70,  
    resizeMode: "contain",
    marginBottom: 5,
  },
  menuGrid: {
    flexDirection: "row",           // Changed from "column" to "row"
    justifyContent: "space-between", // Added to space items evenly
    flexWrap: "wrap",               // Added to wrap items to next row
    rowGap: 16,                     // Adjusted from 40
    columnGap: 16,                  // Added column gap
    marginTop: 20,                  // Adjusted from 37
    paddingBottom: 20,
  },
  menuItem: {
    width: "47%",                   // Changed from "80%" to "47%"
    aspectRatio: 1,                 // Changed from 2.5 to 1 (square)
    borderRadius: 20,
    overflow: "hidden",             // Added to clip content at borders
    marginBottom: 0,                // Removed marginBottom (using rowGap instead)
  },
  iconContainer: {
    flex: 1,                        // Changed to use flex
    alignItems: "center",
    justifyContent: "center",
    width: "100%",                  // Added full width
    marginBottom: 0,                // Removed bottom margin
  },
  imageStyle: {
    width: "100%",                  // Changed to full width
    height: "100%",                 // Changed to full height
    aspectRatio: 1,                 // Added to maintain aspect ratio
    borderRadius: 15,               // Added border radius
    resizeMode: "contain",
  },
  menuText: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
    marginTop: 5,
    position: "absolute",           // Added to position text at bottom
    bottom: 10,                     // Added to position text at bottom
    width: "100%",                  // Added full width for text
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
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
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  cancelScanButton: {
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginTop: 20,
  },
  cancelScanButtonText: {
    fontSize: 16,
    color: '#721c24',
  },
});

export default HomeScreen;
