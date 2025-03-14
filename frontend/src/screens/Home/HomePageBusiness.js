//Screen Creator Tilmi
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { encode as base64Encode } from "base-64";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

const MenuItem = ({ image, title, onPress, backgroundColor }) => (
  <TouchableOpacity
    style={[styles.menuItem, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.7} // Add feedback when pressed
    hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }} // Explicit hit area
  >
    <View style={styles.menuItemContent}>
      <View style={styles.iconContainer}>
        <Image
          source={image}
          style={styles.imageStyle}
          resizeMode="contain"
          onError={(error) => console.error("Image loading error:", error)}
        />
      </View>
      <Text style={styles.menuText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Replace old useEffect with new permission check
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleQrScan = () => {
    setModalVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setModalVisible(false);

    let finalData = data;
    // Check if the data is a data URL and extract base64
    if (data.includes("base64,")) {
      finalData = data.split("base64,")[1];
    }

    navigation.navigate("MyGems", {
      qrCodeUrl: finalData, // Changed from qrCodeImage to qrCodeUrl
    });
  };

  const handleScanFromCamera = () => {
    setModalVisible(false);
    setScanning(true);
  };

  const handleScanFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        base64: true,
        width: 300,
        height: 300,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        try {
          const scannedBarcodes = await BarCodeScanner.scanFromURLAsync(
            result.assets[0].uri
          );

          if (scannedBarcodes.length > 0) {
            const scannedUrl = scannedBarcodes[0].data;
            console.log("Scanned URL:", scannedUrl);

            setModalVisible(false);
            navigation.navigate("MyGems", {
              qrCodeUrl: scannedUrl, // Changed from qrCodeImage to qrCodeUrl
            });
          } else {
            Alert.alert("Error", "No valid QR code found in the image");
          }
        } catch (error) {
          console.error("QR scanning error:", error);
          Alert.alert("Error", "Failed to scan QR code");
        }
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to process image");
    }
  };

  // Updated menu items to match the screenshot
  const menuItems = [
    {
      image: require("../../assets/menu-icons/1.png"),
      screen: "HomeMyGems",
    },
    {
      image: require("../../assets/menu-icons/2.png"),
      onPress: handleQrScan,
    },
    {
      image: require("../../assets/menu-icons/3.png"),
      screen: "OwnerFinancialRecords",
    },
    {
      image: require("../../assets/menu-icons/4.png"),
      screen: "Tracker",
    },
    {
      image: require("../../assets/menu-icons/5.png"),
      screen: "ConnectScreen",
    },
    {
      image: require("../../assets/menu-icons/6.png"),
      screen: "GemOnDisplay",
    },
  ];

  const handleMenuItemPress = (screenName, customOnPress) => {
    if (customOnPress) {
      customOnPress();
    } else if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.log(`No screen defined for this item`);
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
            
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  image={item.image}
                  title={item.title}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
                  backgroundColor={item.backgroundColor}
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
    paddingTop: 26,
  },

  logo: {
    width: 140,  // Adjust based on your logo size
    height: 75,   // Adjust height accordingly
    resizeMode: "contain",
    marginBottom: 5,
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 16,
    columnGap: 16, // Add explicit gap between columns
    marginTop: 10,
    paddingBottom: 20, // Space for bottom nav bar
  },
  menuItem: {
    width: "47%", // Slightly smaller to ensure proper spacing
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden", // Ensure touch events don't leak
  },
  menuItemContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
  },
  menuText: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "500", // Medium weight for better readability
    marginTop: 5,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  cancelScanButton: {
    padding: 12,
    backgroundColor: "#f8d7da",
    borderRadius: 8,
    marginTop: 20,
  },
  cancelScanButtonText: {
    fontSize: 16,
    color: "#721c24",
  },
  permissionButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
