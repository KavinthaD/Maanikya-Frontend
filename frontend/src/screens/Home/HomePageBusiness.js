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
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import { homeStyles, HomeScreenComponents } from "../../styles/homeScreenStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return <HomeScreenComponents.PermissionRequest onRequestPermission={requestPermission} />;
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
      qrCodeUrl: finalData,
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
              qrCodeUrl: scannedUrl,
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

  // Menu items with standardized format
  const menuItems = [
    {
      image: require("../../assets/menu-icons/gem-inventory.jpg"),
      screen: "HomeMyGems",
      title: "Gems Inventory"
    },
    {
      image: require("../../assets/menu-icons/scan-qr.jpg"),
      onPress: handleQrScan,
      title: "Scan QR"
    },
    {
      image: require("../../assets/menu-icons/financial.jpg"),
      screen: "OwnerFinancialRecords",
      title: "Financial Records"
    },
    {
      image: require("../../assets/menu-icons/tracker.jpg"),
      screen: "Tracker",
      title: "Gem orders"
    },
    {
      image: require("../../assets/menu-icons/contacts.jpg"),
      screen: "Contacts",
      title: "Contacts"
    },
    {
      image: require("../../assets/menu-icons/gems-on-market.jpg"),
      screen: "GemOnDisplay",
      title: "Gems on Market"
    },
    {
      image: require("../../assets/menu-icons/chat.jpg"),
      screen: "MessageInbox",
      title: "Messages"
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
          <HomeScreenComponents.QRScannerOverlay onCancel={() => setScanning(false)} />
        </CameraView>
      ) : (
        <ScrollView 
          style={homeStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={homeStyles.content}>
            <Image source={require("../../assets/logo-letter.png")} style={homeStyles.logo}/>
            
            <View style={styles.menuGridThreeColumns}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItemThreeColumn}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
                  activeOpacity={0.7}
                >
                  <View style={homeStyles.menuItemContent}>
                    <View style={homeStyles.iconContainer}>
                      <Image
                        source={item.image}
                        style={styles.imageStyleThreeColumn}
                        resizeMode="cover"
                        onError={(error) => console.error("Image loading error:", error)}
                      />
                      <View style={homeStyles.overlayContainer}>
                        <Text style={styles.menuTextSmaller}>{item.title}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Add some padding at the bottom for better scrolling */}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      <HomeScreenComponents.QRScannerModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onCameraPress={handleScanFromCamera}
        onGalleryPress={handleScanFromGallery}
      />
    </View>
  );
};

// Local styles specific to the 3-column layout
const styles = StyleSheet.create({
  menuGridThreeColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 15,
    marginTop: 16,
    paddingBottom: 30,
  },
  menuItemThreeColumn: {
    width: "31%", // Adjusted to fit 3 items per row with spacing
    aspectRatio: 0.78, // Slightly taller for better proportions with smaller width
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  imageStyleThreeColumn: {
    width: "100%",
    height: "100%",
    aspectRatio: 0.78,
    borderRadius: 12,
  },
  menuTextSmaller: {
    fontSize: 12, // Smaller font for the narrower items
    textAlign: "center",
    color: baseScreenStyles.colors.primary,
    fontWeight: "600",
  }
});

export default HomeScreen;