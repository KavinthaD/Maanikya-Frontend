//Screen Creator Tilmi
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { encode as base64Encode } from "base-64";
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
import { baseScreenStyles } from "../../styles/baseStyles";
import Header_1 from "../../components/Header_1";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import GradientContainer from "../../components/GradientContainer";


const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image
        source={image}
        style={styles.imageStyle}
        resizeMode="contain"
        onError={(error) => console.error("Image loading error:", error)}
      />
    </View>
    <Text style={styles.menuText}>{title}</Text>
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
      setHasPermission(status === "granted");
    })();
  }, []);

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
      qrCodeImage: finalData,
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

  const menuItems = [
    {
      image: require("../../assets/menu-icons/addGem.png"),
      title: "Add Gem",
      screen: "GemRegister1",
    },
    {
      image: require("../../assets/menu-icons/myGems.png"),
      title: "My Gems",
      screen: "HomeMyGems",
    },
    {
      image: require("../../assets/menu-icons/scan.png"),
      title: "Scan",
      onPress: handleQrScan,
    },
    {
      image: require("../../assets/menu-icons/financialRecords.png"),
      title: "Financial\nRecords",
      screen: "OwnerFinancialRecords",
    },
    {
      image: require("../../assets/menu-icons/Tracker.png"),
      title: "Tracker",
      screen: "Tracker",
    },
    {
      image: require("../../assets/menu-icons/connect.png"),
      title: "Connect",
      screen: "ConnectScreen",
    },
    {
      image: require("../../assets/menu-icons/GemsOnDisplay.png"),
      title: "Gems on\ndisplay",
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
    <GradientContainer>
    <View style={baseScreenStyles.container}>
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
          <Header_1 title="Home" />
          <View style={styles.content}>
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
          >
            <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
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
});

export default HomeScreen;
