//Screen Creator Tilmi

import React, { useState } from "react";
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
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { useNavigation } from "@react-navigation/native";



const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image source={image} style={styles.imageStyle} resizeMode="contain" />
    </View>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const HomePageCustomer = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleQrScan = () => {
    setModalVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setModalVisible(false);
    navigation.navigate("Gems", { 
      qrCodeUrl: data
    });
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
            navigation.navigate("Gems", { 
              qrCodeUrl: scannedBarcodes[0].data 
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
      image: require("../../assets/menu-icons/8.png"),
    },
    {
      image: require("../../assets/menu-icons/2.png"),
      onPress: handleQrScan, // Add the scan handler
    },
    {
      image: require("../../assets/menu-icons/7.png"),
      screen: "Customeraddseller",
    },
  ];

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
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barCodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
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
        </CameraView>
      ) : (
        <>

          <View style={styles.content}>
            <Image source={require("../../assets/logo-letter.png")} style={styles.logo}/>
            <Text style={styles.greeting}>Hello Rathnasiri,</Text>
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  image={item.image}
                  title={item.title}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
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
          ><Text style={[styles.modalButtonText, styles.cancelButtonText]}>
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
  greeting: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
    fontWeight: "500",
  },
  menuGrid: {
    flexDirection: "column", // Changed from row to column
    alignItems: "center", // Center items horizontally
    justifyContent: 'flex-start',
    rowGap: 50,
    marginTop: 10,
    paddingBottom: 20,
  },
  menuItem: {
    width: "80%", // Increased width for single column
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    aspectRatio: 2.5, // Changed aspect ratio for better horizontal layout
    marginBottom: 16, // Added margin between items
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    height: 100,
    width: "100%", // Added width to ensure full width usage
  },
  imageStyle: {
    width: "100%", // Changed to use percentage
    height: 150, // Adjusted height
    resizeMode: "contain", // Ensure image fits properly
  },
  menuText: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
    marginTop: 5,
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

export default HomePageCustomer;
